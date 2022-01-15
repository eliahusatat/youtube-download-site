const { logger } = require('../utils/logger')
const youtubeSearch = require('youtube-search-without-api-key')
const { google } = require('googleapis')
const ytDurationFormat = require('youtube-duration-format')
const Fetch = require('../service/Fetch')
const sendMail = require('../service/MailService')

const service = google.youtube({
  version: 'v3',
  auth: process.env.API_KEY
})

const search = async (req, res) => {
  console.log('in youtuber')
  try {
    const str = req.body.str
    let videos = await youtubeSearch.search(str)

    videos = videos.map(function (element) {
      const obj = {
        videoId: element.id.videoId,
        url: element.snippet.thumbnails.url,
        title: element.title,
        publishedAt: element.snippet.publishedAt,
        duration: element.snippet.duration,
        views: element.views
      }
      return obj
    })
    res.send({ success: true, videos: videos })
    logger.info({ message: { step: 'end', name: 'youtube', time: new Date() } })
  } catch (e) {
    console.log('in youtuber catch')
    // logger.error({route: 'sendCampaign', error: e.message});
    res.send({ success: false, error: e.message })
  }
}

const mostPopular = async (req, res) => {
  console.log('in google youtuber')
  try {
    const ans = await service.videos.list({
      part: ['snippet , contentDetails , statistics'],
      chart: 'mostPopular',
      videoCategoryId: 20,
      regionCode: 'IS',
      maxResults: 40
    })
    const videos = ans.data.items.map(function (element) {
      let obj = {}
      if (element.snippet && element.statistics && element.contentDetails) {
        obj = {
          videoId: element.id,
          url: element.snippet.thumbnails.default.url,
          title: element.snippet.title,
          publishedAt: element.snippet.publishedAt.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/, '$3/$2/$1'),
          duration: ytDurationFormat(element.contentDetails.duration),
          views: element.statistics.viewCount,
          description: element.snippet.description,
          commentCount: element.statistics.commentCount
        }
      }
      return obj
    })
    res.send({ success: true, videos: videos })
    logger.info({ message: { step: 'end', name: 'youtube', time: new Date() } })
  } catch (e) {
    console.log('in youtuber catch')
    // logger.error({route: 'sendCampaign', error: e.message});
    res.send({ success: false, error: e.message })
  }
}

const searchNew = async (req, res) => {
  console.log('in google youtuber')
  try {
    const str = req.body.str
    console.log(str)
    const ans = await service.search.list({
      part: ['snippet'],
      q: str,
      maxResults: 20
    })
    const videos = ans.data.items
    const newVideos = []
    videos.forEach((item, index) => {
      console.log(item.id.videoId)
      if (item.id.videoId) {
        const videoData = service.videos.list({
          part: ['snippet , contentDetails , statistics'],
          id: item.id.videoId
        })
        newVideos.push(videoData)
      }
    })
    Promise.all(newVideos).then(data => {
      const finalAns = data.map(function (element) {
        const obj = {
          videoId: element.data.items[0].id,
          url: element.data.items[0].snippet.thumbnails.high.url,
          title: element.data.items[0].snippet.title,
          publishedAt: element.data.items[0].snippet.publishedAt.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/, '$3/$2/$1'),
          duration: ytDurationFormat(element.data.items[0].contentDetails.duration),
          views: element.data.items[0].statistics.viewCount
        }
        return obj
      })

      // let final_ans = data.map(function(element){
      // return element.data.items[0];
      // });
      res.send({ success: true, videos: finalAns })
    }).catch(e => {
      res.send({ success: false, error: e.message })
    })
    logger.info({ message: { step: 'end', name: 'youtube', time: new Date() } })
  } catch (e) {
    console.log('in youtuber catch')
    // logger.error({route: 'sendCampaign', error: e.message});
    res.send({ success: false, error: e.message })
  }
}

const relatedToVideo = async (req, res) => {
  try {
    const videoId = req.body.video_id
    console.log(videoId)
    const ans = await service.search.list({
      part: ['snippet'],
      maxResults: 20,
      relatedToVideoId: videoId,
      type: 'video'
    })
    const videos = ans.data.items
    const newVideos = []
    videos.forEach((item, index) => {
      const videoData = service.videos.list({
        part: ['snippet , contentDetails , statistics'],
        id: item.id.videoId
      })
      newVideos.push(videoData)
    })
    Promise.all(newVideos).then(data => {
      data = data.filter(el => el.data.items[0] !== undefined)
      const finalAns = data.map(function (element) {
        const obj = {
          videoId: element.data.items[0].id,
          url: element.data.items[0].snippet.thumbnails.high.url,
          title: element.data.items[0].snippet.title,
          publishedAt: element.data.items[0].snippet.publishedAt.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/, '$3/$2/$1'),
          duration: ytDurationFormat(element.data.items[0].contentDetails.duration),
          views: element.data.items[0].statistics.viewCount
        }
        return obj
      })
      res.send({ success: true, videos: finalAns })
    })
  } catch (e) {
    console.log('in v catch')
    console.log(e.message)
    res.send({ success: false, error: e.message })
  }
}

const videoComments = async (req, res) => {
  try {
    console.log('in video_comments')
    const videoId = req.body.video_id
    console.log(videoId)
    const ans = await service.commentThreads.list({
      part: ['snippet,replies'],
      videoId: videoId
    })
    const comments = ans.data.items.map(function (el) {
      const obj = {
        imgSrc: el.snippet.topLevelComment.snippet.authorProfileImageUrl,
        text: el.snippet.topLevelComment.snippet.textDisplay,
        name: el.snippet.topLevelComment.snippet.authorDisplayName,
        publishedAt: el.snippet.topLevelComment.snippet.publishedAt
      }
      return obj
    })
    res.send({ success: true, comments: comments })
  } catch (e) {
    console.log('in v catch')
    console.log(e.message)
    res.send({ success: false, error: e.message })
  }
}

const videoFullData = async (req, res) => {
  try {
    console.log('in video_full_data')
    const videoId = req.body.video_id
    console.log(videoId)
    const videoData = await service.videos.list({
      part: ['snippet , contentDetails , statistics'],
      id: videoId
    })
    const obj = {
      videoId: videoData.data.items[0].id,
      url: videoData.data.items[0].snippet.thumbnails.standard.url,
      title: videoData.data.items[0].snippet.title,
      publishedAt: videoData.data.items[0].snippet.publishedAt,
      duration: ytDurationFormat(videoData.data.items[0].contentDetails.duration),
      description: videoData.data.items[0].snippet.description,
      commentCount: videoData.data.items[0].statistics.commentCount,
      tags: videoData.data.items[0].snippet.tags,
      channelTitle: videoData.data.items[0].snippet.channelTitle,
      favoriteCount: videoData.data.items[0].statistics.favoriteCount,
      likeCount: videoData.data.items[0].statistics.likeCount,
      viewCount: videoData.data.items[0].statistics.viewCount
    }

    res.send({ success: true, data: obj })
  } catch (e) {
    console.log('in v catch')
    console.log(e.message)
    res.send({ success: false, error: e.message })
  }
}

const videoFullDataDemo = async (req, res) => {
  try {
    console.log('in video_full_data_demo')
    const videoId = req.body.video_id
    console.log(videoId)
    const videoData = {
      videoId: 'AqdAtTu8Aes',
      url: 'https://i.ytimg.com/vi/AqdAtTu8Aes/sddefault.jpg',
      title: 'WHISKEY BLUES MUSIC | BEST OF SLOW BLUES & ROCK BALLADS | REAXING ELECTRIC GUITAR BLUES',
      publishedAt: '2021-11-13T07:45:12Z',
      duration: '5:57:37',
      description: "Music is also used for what you say, not just for entertainment, but also for accompanying us while we perform other missions. My passion is writing, and my habit of listening to blues while doing it produces amazing results because of the simple fact that it motivates and ignites the imagination. This playlist features great songs and performers. \n- Please Subscribe New My Channel : https://www.youtube.com/c/JAZZBLUES37999\nTracklist :\n[00:00:00]  -  Blues Delight Slightly Hung Over\n[00:04:48]  -  Sam Myers - ''I've Got The Blues'\n[00:10:59]  -  Albert Cummings - Lonely Bed\n[00:18:21]  -  Buster Benton - Money Is The Name of The Game\n[00:24:28]  -  Chris Bell - Elevator To Heaven\n[00:33:37]  -  Christian Willisohn - Blues In My Bottle\n[00:39:11]  -  Daniel Castro - I'll Play The Blues For You\n[00:46:54]  -  Guy Davis - Loneliest Road That I Know\n[00:54:19]  -  Henrik Freischlader - Lonely World\n[01:02:45]  -  JT Coldfire - She's Crazy\n[01:08:08]  -  Mighty Mo Rodgers - Picasso Blue\n[01:14:53]  -  Mike Griffin - The Blues Ain't Never Gonna Die\n[01:26:32]  -  Rory Gallagher - What In The World\n[01:35:55]  -  Tin Pan - Evening\n[01:42:06]  -  Big Ed Sullivan - Don't Wanna Sleep\n[01:49:57]  -  Blue Stew - Bringing Home The Blues\n[01:56:04]  -  Blues Delight - If I Had Money\n[02:02:56]  -  D Man - Ain't Enough Whiskey\n[02:11:32]  -  Lara Price - Crazy\n[02:19:31]  -  Main Street Blues - Tin Pan Alley\n[02:26:20]  -  Mick Kolassa - Baby's Got Another Lover\n[02:33:52]  -  Pete Gage - Blues Has Got Me\n[02:39:25]  -  Sons Of Blues - As The Years Go Passing By\n[02:47:09]  -  The Black Circles - Bad Luck\n[02:56:48]  -  The Buddaheads - Mountain Of Blues\n[03:04:01]  -  John Mast - Don't Speak Darlin'\n[03:09:15]  -  PK Mayo - Arms Of The Blues\n[03:19:00]  -  Beth Hart - Jazz Man\n[03:23:03]  -  Blue Largo - Elevator To The Gallows\n[03:29:08]  -  Claudia Bettinaglio - Invitation To The Blues\n[03:34:58]  -  Corey Stevens - Blues Are Here To Stay\n[03:41:11]  -  Eilen Jewell - I Remember You\n[03:46:08]  -  John Littlejohn - Sweet Little Angel\n[03:53:43]  -  John Mast - Don't Speak Darlin'\n[03:58:57]  -  Matt O'Ree - Something to Say\n[04:07:20]  -  Melvin Taylor - Dirty Pool\n[04:14:21]  -  Michael Van Merwyk - Don't Want To Know\n[04:18:58]  -  Neal Black - Misery\n[04:24:01]  -  Oli Brown - I Love You More You'll Ever Know\n[04:31:15]  -  Replay - A Girl In Mississippi\n[04:35:34]  -   Smokin' Gun - Nothin Good To Say\n[04:43:15]  -  Taj Mahal - Catfish Blues\n[04:49:41]  -  Chris Hicks - Blues Got Me Down\n[04:56:19]  -  Pat O'Bryan - Loan Me A Dime\n[05:04:12]  -  Savoy Brown - Blues Like Midnight\n[05:14:07]  -  Bad Temper Joe - If Tears Were Diamonds\n[05:21:44]  -  Checkerboard Blues Band - Trouble Trouble Trouble\n[05:32:17]  -  Kevin Selfe - Devil's Come Early To Collect His Due\n[05:40:12]  -  Alan Price - To Ramona\n[05:43:21]  -  Allison Thrash - Sugar Is Sugar\n[05:47:55]  -  Amleto Barboni - She Brings Me Down In Pain\n[05:55:56]  -  Big Papa & The TCB - Too Many Dirty Dishes\n\nImage address  : \n-----------------------------------------------------------------------------------\n✔Thanks for watching! Have a nice day!\n✔Don't forget LIKE - SHARE - COMMENT\n✔Enjoy some other Blues Music albums here \n\n #BluesMusic#slowblues#BluesRock#\nRelax and enjoy a few drinks while listening to this music. 🥃🎸\n\n#JAZZ & #BLUES is a trademark of YouTube channel that contains unlicensed / copyrighted music and videos that bring the power of music through an impressive audio visual experience for you to enjoy your music in the most relaxing way . This channel is not only for entertainment purposes but also to motivate, encourage and help you find your peace through music to relax while brooding with your passion.",
      commentCount: '65',
      tags: [
        'blues music',
        'whiskey blues',
        'blues',
        'relaxing blues music',
        'blues songs',
        'slow blues',
        'blues mix',
        'blues playlist',
        'blues guitar',
        'electric blues',
        'blues rock',
        'blues rock music',
        'jazz blues',
        'modern blues',
        'piano blues',
        'sad blues',
        'best of blues',
        'music',
        'music playlist',
        'jazz music',
        'relaxing',
        'chicago blues',
        'blues jazz',
        'jazz guitar',
        'Jazz',
        'electric guitar',
        'whisky blues',
        'relaxing blues',
        'relax music',
        'background music',
        'blues whisky',
        'dark blues',
        'rock blues',
        'jazz lounge',
        'lounge music'
      ],
      channelTitle: 'JAZZ & BLUES',
      favoriteCount: '0',
      likeCount: '10225',
      viewCount: '520622'

    }

    res.send({ success: true, data: videoData })
  } catch (e) {
    console.log('in v catch')
    console.log(e.message)
    res.send({ success: false, error: e.message })
  }
}

const testFetch = async (req, res) => { Fetch({ req, res, endPoint: 'wikipedia/search-on-wikipedia', method: 'POST' }) }

const mail = async (req, res) => {
  try {
    const from = req.body.from
    const to = req.body.to
    const subject = req.body.subject
    const text = req.body.text
    await sendMail({ from, to, subject, text })
    res.send({ success: true, message: 'mail send' })
  } catch (e) {
    logger.error({ route: 'mail', error: e.message })
    res.send({ success: false, error: e.message })
  }
}

const demo = async (req, res) => {
  setTimeout(function () {
    const json = [
      {
        videoId: '5PVJEC_bprg',
        url: 'https://i.ytimg.com/vi/5PVJEC_bprg/sddefault.jpg',
        title: 'KSI QUITS ON GTA 5',
        publishedAt: '30/12/2021',
        duration: '21:57',
        views: '2610495'
      },
      {
        videoId: '-Y6K7F58ee0',
        url: 'https://i.ytimg.com/vi/-Y6K7F58ee0/sddefault.jpg',
        title: 'Chapter 3 No Way Home',
        publishedAt: '25/12/2021',
        duration: '17:45',
        views: '10104162'
      },
      {
        videoId: '8ANfAt4hJ6Y',
        url: 'https://i.ytimg.com/vi/8ANfAt4hJ6Y/sddefault.jpg',
        title: "Game Theory: FNAF, Don't Trust Gregory (FNAF Security Breach)",
        publishedAt: '01/01/2022',
        duration: '18:52',
        views: '4492887'
      },
      {
        videoId: 'yr39T57ATq0',
        url: 'https://i.ytimg.com/vi/yr39T57ATq0/sddefault.jpg',
        title: 'BEST SIDEMEN REACTS MOMENTS 2021!',
        publishedAt: '30/12/2021',
        duration: '14:37',
        views: '1518237'
      },
      {
        videoId: 'LsWwhmy8wf0',
        url: 'https://i.ytimg.com/vi/LsWwhmy8wf0/sddefault.jpg',
        title: 'My Minecraft House Tour',
        publishedAt: '30/12/2021',
        duration: '18:21',
        views: '2191113'
      },
      {
        videoId: '9wO0UkwKT4Y',
        url: 'https://i.ytimg.com/vi/9wO0UkwKT4Y/sddefault.jpg',
        title: 'Random Roles *8* in Among Us',
        publishedAt: '02/01/2022',
        duration: '15:40',
        views: '2115823'
      },
      {
        videoId: 'nByMYn4st1A',
        url: 'https://i.ytimg.com/vi/nByMYn4st1A/sddefault.jpg',
        title: "Five Nights at Freddy's: Security Breach - Part 9",
        publishedAt: '26/12/2021',
        duration: '3:31:38',
        views: '11367559'
      },
      {
        videoId: '1j0xh5NYqk0',
        url: 'https://i.ytimg.com/vi/1j0xh5NYqk0/sddefault.jpg',
        title: 'I Surprised My Girlfriend With A Custom Minecraft World',
        publishedAt: '03/01/2022',
        duration: '09:09',
        views: '1038508'
      },
      {
        videoId: 'pewyPjEyzPM',
        url: 'https://i.ytimg.com/vi/pewyPjEyzPM/sddefault.jpg',
        title: 'MY FINAL MEME TIME',
        publishedAt: '31/12/2021',
        duration: '29:27',
        views: '2376334'
      },
      {
        videoId: 'A91dAT6ozCM',
        url: 'https://i.ytimg.com/vi/A91dAT6ozCM/sddefault.jpg',
        title: 'Pick A Side Youtube',
        publishedAt: '29/12/2021',
        duration: '13:08',
        views: '2319775'
      },
      {
        videoId: 'rdsXcS4guLQ',
        url: 'https://i.ytimg.com/vi/rdsXcS4guLQ/sddefault.jpg',
        title: '10 vs 1000 Player Manhunt!',
        publishedAt: '23/12/2021',
        duration: '11:14',
        views: '12337232'
      },
      {
        videoId: 'wG1Q1ouemVA',
        url: 'https://i.ytimg.com/vi/wG1Q1ouemVA/sddefault.jpg',
        title: 'I Almost Became An Amputee',
        publishedAt: '24/12/2021',
        duration: '11:31',
        views: '6566580'
      },
      {
        videoId: 'd8FzTO0wu8A',
        url: 'https://i.ytimg.com/vi/d8FzTO0wu8A/sddefault.jpg',
        title: 'My NEW HOME in Minecraft Hardcore... (#2)',
        publishedAt: '31/12/2021',
        duration: '15:22',
        views: '1575297'
      },
      {
        videoId: '4J_-e5EbIlI',
        url: 'https://i.ytimg.com/vi/4J_-e5EbIlI/sddefault.jpg',
        title: 'THE BEST 85 X 10 WILDCARD PACKS!! 10 WALKOUTS IN SAME PACK!!',
        publishedAt: '27/12/2021',
        duration: '14:49',
        views: '368652'
      },
      {
        videoId: '04v11ArCQrk',
        url: 'https://i.ytimg.com/vi/04v11ArCQrk/sddefault.jpg',
        title: 'The Best of TommyInnit 2021!',
        publishedAt: '28/12/2021',
        duration: '2:09:15',
        views: '2604634'
      },
      {
        videoId: 'Rlg4K16ujFw',
        url: 'https://i.ytimg.com/vi/Rlg4K16ujFw/sddefault.jpg',
        title: 'Gaming on Linux is NOT Ready... - Daily Driver Challenge Finale',
        publishedAt: '01/01/2022',
        duration: '17:30',
        views: '936870'
      },
      {
        videoId: 'BlkmrwqttJs',
        url: 'https://i.ytimg.com/vi/BlkmrwqttJs/sddefault.jpg',
        title: 'Wholesome Ways To Mess With Your Friends In Minecraft',
        publishedAt: '31/12/2021',
        duration: '16:48',
        views: '1769043'
      },
      {
        videoId: 'E5k2uhqAvtE',
        url: 'https://i.ytimg.com/vi/E5k2uhqAvtE/sddefault.jpg',
        title: '85+ x10 Packs decide my FIFA 22 team!',
        publishedAt: '27/12/2021',
        duration: '11:57',
        views: '466800'
      },
      {
        videoId: 'Ew3RNsMxXR0',
        url: 'https://i.ytimg.com/vi/Ew3RNsMxXR0/sddefault.jpg',
        title: 'Fortnite Servers are OFFLINE!!',
        publishedAt: '29/12/2021',
        duration: '08:22',
        views: '1509297'
      },
      {
        videoId: 'A8WZuDCAeLM',
        url: 'https://i.ytimg.com/vi/A8WZuDCAeLM/sddefault.jpg',
        title: '11 Levels of Minecraft Door: From Noob to Pro',
        publishedAt: '30/12/2021',
        duration: '10:44',
        views: '1233579'
      },
      {
        videoId: '34P14kLEi8Y',
        url: 'https://i.ytimg.com/vi/34P14kLEi8Y/sddefault.jpg',
        title: 'RANKING EVERY SIDEMEN SUNDAY 2021!',
        publishedAt: '30/12/2021',
        duration: '16:34',
        views: '336030'
      },
      {
        videoId: 'W2SdRSSUfrk',
        url: 'https://i.ytimg.com/vi/W2SdRSSUfrk/sddefault.jpg',
        title: 'Aphmau Is PREGNANT With TRIPLETS In Minecraft!',
        publishedAt: '30/12/2021',
        duration: '20:05',
        views: '3036242'
      },
      {
        videoId: 'QbJJwaVdgIs',
        url: 'https://i.ytimg.com/vi/QbJJwaVdgIs/sddefault.jpg',
        title: 'I Got Hunted By The Military',
        publishedAt: '10/12/2021',
        duration: '11:02',
        views: '46615224'
      },
      {
        videoId: 'FdFJzNC0NPI',
        url: 'https://i.ytimg.com/vi/FdFJzNC0NPI/sddefault.jpg',
        title: 'Halo Infinite (dunkview)',
        publishedAt: '21/12/2021',
        duration: '06:54',
        views: '2593455'
      },
      {
        videoId: 'CpFCiuOtjDg',
        url: 'https://i.ytimg.com/vi/CpFCiuOtjDg/sddefault.jpg',
        title: 'The Vanny Ending is MESSED UP! (FNAF Security Breach Part 7)',
        publishedAt: '23/12/2021',
        duration: '49:54',
        views: '1792926'
      },
      {
        videoId: 'yztfpyO1eI4',
        url: 'https://i.ytimg.com/vi/yztfpyO1eI4/sddefault.jpg',
        title: 'Fifa 22 Squad Builder Showdown Advent Calendar!!! FLASHBACK KANTE!!! Day 23 vs Itani',
        publishedAt: '23/12/2021',
        duration: '31:32',
        views: '301873'
      },
      {
        videoId: 'b_h2ZdqqUQQ',
        url: 'https://i.ytimg.com/vi/b_h2ZdqqUQQ/sddefault.jpg',
        title: "What happens if you interrupt Vanessa torturing Freddy? - Five Nights at Freddy's: Security Breach",
        publishedAt: '23/12/2021',
        duration: '00:49',
        views: '2494623'
      },
      {
        videoId: 'VzQtuqfiV2A',
        url: 'https://i.ytimg.com/vi/VzQtuqfiV2A/sddefault.jpg',
        title: 'MR BEAST WANTS THE SIDEMEN...',
        publishedAt: '21/12/2021',
        duration: '17:35',
        views: '1193320'
      },
      {
        videoId: 'rqgOzu-udFY',
        url: 'https://i.ytimg.com/vi/rqgOzu-udFY/sddefault.jpg',
        title: 'The Ultimate "Minecraft" Recap Cartoon',
        publishedAt: '17/12/2021',
        duration: '10:41',
        views: '7183359'
      },
      {
        videoId: 'iui52h779U8',
        url: 'https://i.ytimg.com/vi/iui52h779U8/sddefault.jpg',
        title: 'Spider Man TRIVIA in Fortnite!',
        publishedAt: '15/12/2021',
        duration: '09:39',
        views: '4099729'
      },
      {
        videoId: 'YVCiterG0P4',
        url: 'https://i.ytimg.com/vi/YVCiterG0P4/sddefault.jpg',
        title: "i'm quitting youtube",
        publishedAt: '16/12/2021',
        duration: '04:02',
        views: '2034744'
      },
      {
        videoId: '_0MXhG1shEc',
        url: 'https://i.ytimg.com/vi/_0MXhG1shEc/sddefault.jpg',
        title: 'Minecraft Speedrunner VS 5 Hunters FINALE REMATCH',
        publishedAt: '01/12/2021',
        duration: '35:22',
        views: '23802060'
      },
      {
        videoId: 'v8B2pCai-bM',
        url: 'https://i.ytimg.com/vi/v8B2pCai-bM/sddefault.jpg',
        title: 'i used BANNED fortnite items',
        publishedAt: '17/12/2021',
        duration: '12:31',
        views: '1497100'
      },
      {
        videoId: 'vsTDQs-dNoE',
        url: 'https://i.ytimg.com/vi/vsTDQs-dNoE/sddefault.jpg',
        title: '0.000069% ODDS (perfect timing)',
        publishedAt: '17/12/2021',
        duration: '07:49',
        views: '5718969'
      },
      {
        videoId: 'T_Arb_F71wk',
        url: 'https://i.ytimg.com/vi/T_Arb_F71wk/sddefault.jpg',
        title: 'A Pokemon YouTuber thought he was better than me...',
        publishedAt: '15/12/2021',
        duration: '16:11',
        views: '2256622'
      },
      {
        videoId: '4cJpiOPKH14',
        url: 'https://i.ytimg.com/vi/4cJpiOPKH14/sddefault.jpg',
        title: 'Star Wars Eclipse – Official Cinematic Reveal Trailer',
        publishedAt: '10/12/2021',
        duration: '02:50',
        views: '10890511'
      },
      {
        videoId: 'hPqFQkmTsAY',
        url: 'https://i.ytimg.com/vi/hPqFQkmTsAY/sddefault.jpg',
        title: 'Fortnite Winterfest 2021 Begins',
        publishedAt: '16/12/2021',
        duration: '00:34',
        views: '19598425'
      },
      {
        videoId: '9MhwHkKW5UU',
        url: 'https://i.ytimg.com/vi/9MhwHkKW5UU/sddefault.jpg',
        title: 'Brawl Stars: Brawl Talk - 2 NEW BRAWLERS, BRAWLIDAYS, AND MORE!',
        publishedAt: '11/12/2021',
        duration: '06:31',
        views: '14307463'
      },
      {
        videoId: 'Wbzm7fGIJ-I',
        url: 'https://i.ytimg.com/vi/Wbzm7fGIJ-I/sddefault.jpg',
        title: "20 Secrets YOU MISSED In Fortnite's CHAPTER 3 EVENT!",
        publishedAt: '05/12/2021',
        duration: '08:55',
        views: '3061655'
      },
      {
        videoId: 'vhcM5GGaLYw',
        url: 'https://i.ytimg.com/vi/vhcM5GGaLYw/sddefault.jpg',
        title: 'This Theme Park is 100% Pure Havoc - Planet Coaster',
        publishedAt: '11/12/2021',
        duration: '14:19',
        views: '2581090'
      }
    ]
    //    ans = JSON.parse(json);
    res.send({ success: true, videos: json })
  }, 1000)
}

const demoComments = async (req, res) => {
  setTimeout(function () {
    const json = [{
      kind: 'youtube#commentThread',
      etag: '6ZHm6Cedur6SbU3hBvm4M4C1__g',
      id: 'Ugyowb8JvlOiOyq3ZrF4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: '01Q2dk5gB8BcXauxiV62PhZTz1s',
          id: 'Ugyowb8JvlOiOyq3ZrF4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'изумительная музыка,выпил под неё весь свой бар виски...:D',
            textOriginal: 'изумительная музыка,выпил под неё весь свой бар виски...:D',
            authorDisplayName: 'Funny Girl Shneider',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLSiTE3CfsTU3Iw97E9a5fIMKdb1LkVg2GDkn46x=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCQitmF9dzgVysxtOnPb4BEQ',
            authorChannelId: {
              value: 'UCQitmF9dzgVysxtOnPb4BEQ'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 1,
            publishedAt: '2022-01-02T20:24:48Z',
            updatedAt: '2022-01-02T20:24:48Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'Y7DR4lO5lRbFIESwPyW7hJqYSxU',
      id: 'UgwS6P1EBbqs-hait614AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'QmexDr2QeHVHg_ACayINHdUtHw4',
          id: 'UgwS6P1EBbqs-hait614AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'Rzeczywiście idealne pod szklaneczkę whisky i cygaro, w ciemnym pomieszczeniu, samemu z własnymi myślami. Dzięki',
            textOriginal: 'Rzeczywiście idealne pod szklaneczkę whisky i cygaro, w ciemnym pomieszczeniu, samemu z własnymi myślami. Dzięki',
            authorDisplayName: 'Słodki że aż mdły',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLQWFgohvHXSXj9yWXTXwps7eFZ0vL4kS4V5cXAu=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCR2s0g92H-gYX9LxmC5ejOg',
            authorChannelId: {
              value: 'UCR2s0g92H-gYX9LxmC5ejOg'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 2,
            publishedAt: '2022-01-02T20:18:09Z',
            updatedAt: '2022-01-02T20:18:09Z'
          }
        },
        canReply: true,
        totalReplyCount: 1,
        isPublic: true
      },
      replies: {
        comments: [
          {
            kind: 'youtube#comment',
            etag: 'gamVs-YQU5L2BgqP4ZDU3NcY17M',
            id: 'UgwS6P1EBbqs-hait614AaABAg.9WhvG1Klacx9WkHptFEULH',
            snippet: {
              videoId: 'AqdAtTu8Aes',
              textDisplay: 'Mi służy do długich sesji robienia projektów na studia popijając kawę aromatyzowaną irlandzką whiskey, również polecam z całego serca',
              textOriginal: 'Mi służy do długich sesji robienia projektów na studia popijając kawę aromatyzowaną irlandzką whiskey, również polecam z całego serca',
              parentId: 'UgwS6P1EBbqs-hait614AaABAg',
              authorDisplayName: 'Tomek Stilon',
              authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLSfGjA2vOigNvaSjqtO2EVxbSeWQWrkh5yto1oP=s48-c-k-c0x00ffffff-no-rj',
              authorChannelUrl: 'http://www.youtube.com/channel/UC31iOjp-hJmvLO5NWzWJrug',
              authorChannelId: {
                value: 'UC31iOjp-hJmvLO5NWzWJrug'
              },
              canRate: true,
              viewerRating: 'none',
              likeCount: 1,
              publishedAt: '2022-01-03T18:22:38Z',
              updatedAt: '2022-01-03T18:22:38Z'
            }
          }
        ]
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'xxv7BV7IYzbdshvONI6c5ne_xfQ',
      id: 'UgysIgmpbJDKCho6YuB4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: '7CF4eKw5ImwCZ7TrThlDe3WfzNo',
          id: 'UgysIgmpbJDKCho6YuB4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'Love this💚',
            textOriginal: 'Love this💚',
            authorDisplayName: 'Poison Music',
            authorProfileImageUrl: 'https://yt3.ggpht.com/pIr4IK2Vv9Otg3uD2HvHewLc1BnBw3cIXxt6lNnmA8zNJZg9HRF_yvOo4542ewzmpxsem2ygag0=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UC8MmQQ4D5jPTtYq0K00_X9Q',
            authorChannelId: {
              value: 'UC8MmQQ4D5jPTtYq0K00_X9Q'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 0,
            publishedAt: '2022-01-02T16:46:31Z',
            updatedAt: '2022-01-02T16:46:31Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'z1xQL47c1SSVbIYlAdRXeXtULuM',
      id: 'UgzDdE6LBl-EV9LrJot4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'qXSuCEU4nQbiLAADqFfHN-p1OsQ',
          id: 'UgzDdE6LBl-EV9LrJot4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'Шыкоўна!',
            textOriginal: 'Шыкоўна!',
            authorDisplayName: 'Алекс К',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLTUmE670ZLq3v47vjkMjcdScxZJ-Hm2MDcxjQ=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCTzgnRi5XYLQAKXHQw_jxDQ',
            authorChannelId: {
              value: 'UCTzgnRi5XYLQAKXHQw_jxDQ'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 0,
            publishedAt: '2022-01-02T16:07:39Z',
            updatedAt: '2022-01-02T16:07:39Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'XBwazI1OQlb1-24B5ggSgBfrS3o',
      id: 'UgwrxDC2O2UdNoG9fOR4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'V-nxnodimUHbdoUAKAuc0HVDGco',
          id: 'UgwrxDC2O2UdNoG9fOR4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'eargasm',
            textOriginal: 'eargasm',
            authorDisplayName: 'Raphael Rufino',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLSs5Yzg6t1MUCdne-HBAAovmE17okjeVvQCUDJ3xQ=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UC4GW7Jpvq0rgRXXY6oSPGDw',
            authorChannelId: {
              value: 'UC4GW7Jpvq0rgRXXY6oSPGDw'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 1,
            publishedAt: '2022-01-02T08:03:41Z',
            updatedAt: '2022-01-02T08:03:41Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'y-lwFP3aW13ml9bh8RsV7VDD7SE',
      id: 'UgzPE3FbaRM9TUyzyK54AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'iuXQS-JW1cBYizEa9MD8QkJ4-s4',
          id: 'UgzPE3FbaRM9TUyzyK54AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'So good',
            textOriginal: 'So good',
            authorDisplayName: 'Zlatan İbrahimovič',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLQrRXJasiwKtoPlvmRxfOASda3zKujTA1JzXPWVrHE=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCIgokGTBxmJb8oirJ6FkYCw',
            authorChannelId: {
              value: 'UCIgokGTBxmJb8oirJ6FkYCw'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 1,
            publishedAt: '2022-01-01T12:11:18Z',
            updatedAt: '2022-01-01T12:11:18Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'pyYZyr1ml6YwNR0c2BUMWKlEEo4',
      id: 'Ugy7IYdwa4ztpXubBmR4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: '4nKh_l8EbRQv9MTgA5aPoh1Wipk',
          id: 'Ugy7IYdwa4ztpXubBmR4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'Música de mafiosos de cartón, estás no son músicas de gánsters, payasos. Al Capone tenía otro estilo les falta lectura.',
            textOriginal: 'Música de mafiosos de cartón, estás no son músicas de gánsters, payasos. Al Capone tenía otro estilo les falta lectura.',
            authorDisplayName: 'Jefferson Martillo',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLRuBIxOZZZdcldfvzDIFHE597oM4n9wR2-34Wx6jtPUC1qdKT9mGYyQ70jdo-3q=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCrGfZib_WkfB0R51fa9Quag',
            authorChannelId: {
              value: 'UCrGfZib_WkfB0R51fa9Quag'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 0,
            publishedAt: '2021-12-31T10:21:49Z',
            updatedAt: '2021-12-31T10:22:43Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: '1E6sfTA-1WeLH9Dy4P5s5pkgy8g',
      id: 'UgwNrPwVNCPSYfZI3Xt4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'gu1Rh2-h-y3Y7X77aD8MEXQcYD8',
          id: 'UgwNrPwVNCPSYfZI3Xt4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'Chill Music c:',
            textOriginal: 'Chill Music c:',
            authorDisplayName: 'Donkimon',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLSgQpDO5hUg2W61PU2M-vzkXzjqR_7wR06iJlRM=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCOTbKZbDI9Vd8N0jWS3pRbA',
            authorChannelId: {
              value: 'UCOTbKZbDI9Vd8N0jWS3pRbA'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 0,
            publishedAt: '2021-12-31T01:30:58Z',
            updatedAt: '2021-12-31T01:30:58Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'Eu9K1yJAg-g0Ckz5M-EuU8jCL6Q',
      id: 'Ugzdo1pk7N_Mz3Dzon54AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'VbOs7ebxzWERjoInV4nsUeuPfFk',
          id: 'Ugzdo1pk7N_Mz3Dzon54AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'turk var mi',
            textOriginal: 'turk var mi',
            authorDisplayName: 'Muhammet',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLQS9yJ4j5nuZCRiEEghoo0I5fVWd4CrlblncqliTw=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCc7JOPhfMhvPgOr4_9HNvFQ',
            authorChannelId: {
              value: 'UCc7JOPhfMhvPgOr4_9HNvFQ'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 3,
            publishedAt: '2021-12-30T21:35:09Z',
            updatedAt: '2021-12-30T21:35:09Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'tt4UFuL3GBOtt9EM6P-1mF8aQus',
      id: 'UgymdInGy76Cq8g_nZx4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'b-EqsSfyDTFNNQ4dWdkyCMVed9k',
          id: 'UgymdInGy76Cq8g_nZx4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'Tracklist for those who are Microsoft users/can&#39;t see description due to Youtube&#39;s update:\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=00h00m00s">00:00:00</a>]  -  Blues Delight Slightly Hung Over\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=00h04m48s">00:04:48</a>]  -  Sam Myers - &#39;&#39;I&#39;ve Got The Blues&#39;\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=00h10m59s">00:10:59</a>]  -  Albert Cummings - Lonely Bed\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=00h18m21s">00:18:21</a>]  -  Buster Benton - Money Is The Name of The Game\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=00h24m28s">00:24:28</a>]  -  Chris Bell - Elevator To Heaven\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=00h33m37s">00:33:37</a>]  -  Christian Willisohn - Blues In My Bottle\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=00h39m11s">00:39:11</a>]  -  Daniel Castro - I&#39;ll Play The Blues For You\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=00h46m54s">00:46:54</a>]  -  Guy Davis - Loneliest Road That I Know\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=00h54m19s">00:54:19</a>]  -  Henrik Freischlader - Lonely World\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=01h02m45s">01:02:45</a>]  -  JT Coldfire - She&#39;s Crazy\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=01h08m08s">01:08:08</a>]  -  Mighty Mo Rodgers - Picasso Blue\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=01h14m53s">01:14:53</a>]  -  Mike Griffin - The Blues Ain&#39;t Never Gonna Die\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=01h26m32s">01:26:32</a>]  -  Rory Gallagher - What In The World\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=01h35m55s">01:35:55</a>]  -  Tin Pan - Evening\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=01h42m06s">01:42:06</a>]  -  Big Ed Sullivan - Don&#39;t Wanna Sleep\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=01h49m57s">01:49:57</a>]  -  Blue Stew - Bringing Home The Blues\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=01h56m04s">01:56:04</a>]  -  Blues Delight - If I Had Money\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=02h02m56s">02:02:56</a>]  -  D Man - Ain&#39;t Enough Whiskey\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=02h11m32s">02:11:32</a>]  -  Lara Price - Crazy\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=02h19m31s">02:19:31</a>]  -  Main Street Blues - Tin Pan Alley\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=02h26m20s">02:26:20</a>]  -  Mick Kolassa - Baby&#39;s Got Another Lover\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=02h33m52s">02:33:52</a>]  -  Pete Gage - Blues Has Got Me\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=02h39m25s">02:39:25</a>]  -  Sons Of Blues - As The Years Go Passing By\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=02h47m09s">02:47:09</a>]  -  The Black Circles - Bad Luck\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=02h56m48s">02:56:48</a>]  -  The Buddaheads - Mountain Of Blues\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=03h04m01s">03:04:01</a>]  -  John Mast - Don&#39;t Speak Darlin&#39;\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=03h09m15s">03:09:15</a>]  -  PK Mayo - Arms Of The Blues\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=03h19m00s">03:19:00</a>]  -  Beth Hart - Jazz Man\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=03h23m03s">03:23:03</a>]  -  Blue Largo - Elevator To The Gallows\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=03h29m08s">03:29:08</a>]  -  Claudia Bettinaglio - Invitation To The Blues\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=03h34m58s">03:34:58</a>]  -  Corey Stevens - Blues Are Here To Stay\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=03h41m11s">03:41:11</a>]  -  Eilen Jewell - I Remember You\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=03h46m08s">03:46:08</a>]  -  John Littlejohn - Sweet Little Angel\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=03h53m43s">03:53:43</a>]  -  John Mast - Don&#39;t Speak Darlin&#39;\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=03h58m57s">03:58:57</a>]  -  Matt O&#39;Ree - Something to Say\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=04h07m20s">04:07:20</a>]  -  Melvin Taylor - Dirty Pool\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=04h14m21s">04:14:21</a>]  -  Michael Van Merwyk - Don&#39;t Want To Know\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=04h18m58s">04:18:58</a>]  -  Neal Black - Misery\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=04h24m01s">04:24:01</a>]  -  Oli Brown - I Love You More You&#39;ll Ever Know\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=04h31m15s">04:31:15</a>]  -  Replay - A Girl In Mississippi\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=04h35m34s">04:35:34</a>]  -   Smokin&#39; Gun - Nothin Good To Say\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=04h43m15s">04:43:15</a>]  -  Taj Mahal - Catfish Blues\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=04h49m41s">04:49:41</a>]  -  Chris Hicks - Blues Got Me Down\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=04h56m19s">04:56:19</a>]  -  Pat O&#39;Bryan - Loan Me A Dime\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=05h04m12s">05:04:12</a>]  -  Savoy Brown - Blues Like Midnight\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=05h14m07s">05:14:07</a>]  -  Bad Temper Joe - If Tears Were Diamonds\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=05h21m44s">05:21:44</a>]  -  Checkerboard Blues Band - Trouble Trouble Trouble\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=05h32m17s">05:32:17</a>]  -  Kevin Selfe - Devil&#39;s Come Early To Collect His Due\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=05h40m12s">05:40:12</a>]  -  Alan Price - To Ramona\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=05h43m21s">05:43:21</a>]  -  Allison Thrash - Sugar Is Sugar\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=05h47m55s">05:47:55</a>]  -  Amleto Barboni - She Brings Me Down In Pain\r<br>[<a href="https://www.youtube.com/watch?v=AqdAtTu8Aes&amp;t=05h55m56s">05:55:56</a>]  -  Big Papa &amp; The TCB - Too Many Dirty Dishes',
            textOriginal: "Tracklist for those who are Microsoft users/can't see description due to Youtube's update:\r\n[00:00:00]  -  Blues Delight Slightly Hung Over\r\n[00:04:48]  -  Sam Myers - ''I've Got The Blues'\r\n[00:10:59]  -  Albert Cummings - Lonely Bed\r\n[00:18:21]  -  Buster Benton - Money Is The Name of The Game\r\n[00:24:28]  -  Chris Bell - Elevator To Heaven\r\n[00:33:37]  -  Christian Willisohn - Blues In My Bottle\r\n[00:39:11]  -  Daniel Castro - I'll Play The Blues For You\r\n[00:46:54]  -  Guy Davis - Loneliest Road That I Know\r\n[00:54:19]  -  Henrik Freischlader - Lonely World\r\n[01:02:45]  -  JT Coldfire - She's Crazy\r\n[01:08:08]  -  Mighty Mo Rodgers - Picasso Blue\r\n[01:14:53]  -  Mike Griffin - The Blues Ain't Never Gonna Die\r\n[01:26:32]  -  Rory Gallagher - What In The World\r\n[01:35:55]  -  Tin Pan - Evening\r\n[01:42:06]  -  Big Ed Sullivan - Don't Wanna Sleep\r\n[01:49:57]  -  Blue Stew - Bringing Home The Blues\r\n[01:56:04]  -  Blues Delight - If I Had Money\r\n[02:02:56]  -  D Man - Ain't Enough Whiskey\r\n[02:11:32]  -  Lara Price - Crazy\r\n[02:19:31]  -  Main Street Blues - Tin Pan Alley\r\n[02:26:20]  -  Mick Kolassa - Baby's Got Another Lover\r\n[02:33:52]  -  Pete Gage - Blues Has Got Me\r\n[02:39:25]  -  Sons Of Blues - As The Years Go Passing By\r\n[02:47:09]  -  The Black Circles - Bad Luck\r\n[02:56:48]  -  The Buddaheads - Mountain Of Blues\r\n[03:04:01]  -  John Mast - Don't Speak Darlin'\r\n[03:09:15]  -  PK Mayo - Arms Of The Blues\r\n[03:19:00]  -  Beth Hart - Jazz Man\r\n[03:23:03]  -  Blue Largo - Elevator To The Gallows\r\n[03:29:08]  -  Claudia Bettinaglio - Invitation To The Blues\r\n[03:34:58]  -  Corey Stevens - Blues Are Here To Stay\r\n[03:41:11]  -  Eilen Jewell - I Remember You\r\n[03:46:08]  -  John Littlejohn - Sweet Little Angel\r\n[03:53:43]  -  John Mast - Don't Speak Darlin'\r\n[03:58:57]  -  Matt O'Ree - Something to Say\r\n[04:07:20]  -  Melvin Taylor - Dirty Pool\r\n[04:14:21]  -  Michael Van Merwyk - Don't Want To Know\r\n[04:18:58]  -  Neal Black - Misery\r\n[04:24:01]  -  Oli Brown - I Love You More You'll Ever Know\r\n[04:31:15]  -  Replay - A Girl In Mississippi\r\n[04:35:34]  -   Smokin' Gun - Nothin Good To Say\r\n[04:43:15]  -  Taj Mahal - Catfish Blues\r\n[04:49:41]  -  Chris Hicks - Blues Got Me Down\r\n[04:56:19]  -  Pat O'Bryan - Loan Me A Dime\r\n[05:04:12]  -  Savoy Brown - Blues Like Midnight\r\n[05:14:07]  -  Bad Temper Joe - If Tears Were Diamonds\r\n[05:21:44]  -  Checkerboard Blues Band - Trouble Trouble Trouble\r\n[05:32:17]  -  Kevin Selfe - Devil's Come Early To Collect His Due\r\n[05:40:12]  -  Alan Price - To Ramona\r\n[05:43:21]  -  Allison Thrash - Sugar Is Sugar\r\n[05:47:55]  -  Amleto Barboni - She Brings Me Down In Pain\r\n[05:55:56]  -  Big Papa & The TCB - Too Many Dirty Dishes",
            authorDisplayName: 'Yoru Bam',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLSy8gI0BIIP-SgLMPfhJYi0ehpV-GxqfKEr3EZllQ=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UC8E68dcaG14t-Ad33200ptA',
            authorChannelId: {
              value: 'UC8E68dcaG14t-Ad33200ptA'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 7,
            publishedAt: '2021-12-30T17:46:23Z',
            updatedAt: '2021-12-30T17:46:23Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'YbAzQboLW-xyFToUF53EE_lXV5Y',
      id: 'UgzlU2MZsy94QlWKCmR4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'rt8UWq5j83H7AH97pR3B9Cz5Mu4',
          id: 'UgzlU2MZsy94QlWKCmR4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'turn up the volume and drive into the sunset for freedom..!',
            textOriginal: 'turn up the volume and drive into the sunset for freedom..!',
            authorDisplayName: 'oto kiralama',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLTvZsVcJcBZGXPqLuaNqUROWeNLrbMhm5kjIw=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCnvn3k9X0tURIm3pjqoabYg',
            authorChannelId: {
              value: 'UCnvn3k9X0tURIm3pjqoabYg'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 2,
            publishedAt: '2021-12-28T22:17:43Z',
            updatedAt: '2021-12-28T22:17:43Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'X1gLI5YqPToboaBjnqZRiHQoL4s',
      id: 'UgxQYinahRp63bCuUo94AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'RZaBZxCAC5fCo2ULo5tHnFovWN0',
          id: 'UgxQYinahRp63bCuUo94AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'Playlist perfeita pra namorar rs.',
            textOriginal: 'Playlist perfeita pra namorar rs.',
            authorDisplayName: 'Leandro Souza',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLT3vbmkQwh6VoiHtGi_RQY2XGpgGmhMakDB8o8viQ=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCBjHPE5BsVOPiSzsG0MPhfQ',
            authorChannelId: {
              value: 'UCBjHPE5BsVOPiSzsG0MPhfQ'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 1,
            publishedAt: '2021-12-28T02:14:09Z',
            updatedAt: '2021-12-28T02:14:09Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'xXUqgkfGtkG8uNYU3haiKzxPsX0',
      id: 'UgxtULRPT2lT8tZCngt4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'Zar7PFIhl6XdZAP4rbWYecR-pk4',
          id: 'UgxtULRPT2lT8tZCngt4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'вав омг',
            textOriginal: 'вав омг',
            authorDisplayName: 'Варвар',
            authorProfileImageUrl: 'https://yt3.ggpht.com/j78iPFX4KOQ1k8PbSNxGnxRosmNF7ZqlLTIWTnbzxuq1RGg6GU_ttOUYM3i_E0ZWFBV4C_Szag=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCbZaJ1KHtR5op0RmpHgJ94A',
            authorChannelId: {
              value: 'UCbZaJ1KHtR5op0RmpHgJ94A'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 2,
            publishedAt: '2021-12-27T17:44:11Z',
            updatedAt: '2021-12-27T17:44:11Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'rEQunzHz2yqSVXWAhsM_hBmwfpI',
      id: 'Ugx3_d3kNu9SE9KIrCl4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'qBRXp8PvXP56dSQYhch6yR2_j7E',
          id: 'Ugx3_d3kNu9SE9KIrCl4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'Só queria acompanhar nos riff da Guita. muito bom',
            textOriginal: 'Só queria acompanhar nos riff da Guita. muito bom',
            authorDisplayName: 'Kemuel Duarte',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLQhPpam6xnALSTfnDcekXYZRKWwDDRyO8BwSdS8=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCOH31EGHDdvgwY9Red7AVYA',
            authorChannelId: {
              value: 'UCOH31EGHDdvgwY9Red7AVYA'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 1,
            publishedAt: '2021-12-27T16:00:50Z',
            updatedAt: '2021-12-27T16:00:50Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: '2PDXjqML88-abji5KZ7GgcmBZqQ',
      id: 'UgyJT1ojpJuDWJFuxQ14AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: '2l2UmaMUE2H-61vrbQPAqoqfKB0',
          id: 'UgyJT1ojpJuDWJFuxQ14AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'que buena MUSICA!!!!!',
            textOriginal: 'que buena MUSICA!!!!!',
            authorDisplayName: 'CnG A3',
            authorProfileImageUrl: 'https://yt3.ggpht.com/jjk3vMWv5bQPyn_qSecyX2F4IfWqz4jF_hBKzIerQr5i-Fs1tucnnFuKbLNevuTsP_aQn_q-4g=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCwfjFmKldrZgcwwFlFKbzsw',
            authorChannelId: {
              value: 'UCwfjFmKldrZgcwwFlFKbzsw'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 3,
            publishedAt: '2021-12-27T04:34:51Z',
            updatedAt: '2021-12-27T04:34:51Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'fe0PpR4Qap_D2IA9GYGWsuxV-Mw',
      id: 'Ugx3b_9FMIUatYI-f0N4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'YtwiKrCBQRTRrycnFyfWLIAAjdA',
          id: 'Ugx3b_9FMIUatYI-f0N4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'за окном -15, на ногах спит собака, в руке ром... музыка что надо)',
            textOriginal: 'за окном -15, на ногах спит собака, в руке ром... музыка что надо)',
            authorDisplayName: 'Павел Захаров',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLRge4s6SbkHZZCzWTnTTl_kchNlnLpn0FXQsleW=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UC6TSgTdgvj8trfYF3TI-9Qg',
            authorChannelId: {
              value: 'UC6TSgTdgvj8trfYF3TI-9Qg'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 1,
            publishedAt: '2021-12-25T18:42:15Z',
            updatedAt: '2021-12-25T18:42:15Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'UDKTYLTMnDLQcgnUiFOvetqkrkc',
      id: 'Ugy7-MSnN47TIlK6JWR4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'SS2yoy8v0tnEguraG83M-5xc-qA',
          id: 'Ugy7-MSnN47TIlK6JWR4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: '😎👍🎶🥃🇨🇵',
            textOriginal: '😎👍🎶🥃🇨🇵',
            authorDisplayName: 'N. C.',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLQsIPlzGvMluZVahkmpqTDoujetNWmRxpyi9OfJ=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCEe_V9Cabj9spS9nDpJeZgA',
            authorChannelId: {
              value: 'UCEe_V9Cabj9spS9nDpJeZgA'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 1,
            publishedAt: '2021-12-25T12:09:05Z',
            updatedAt: '2021-12-25T12:09:05Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'Vj-WXOA_Udv7qZQkdb2xG-hKRpA',
      id: 'UgzEe6cGLK5iIpglZeR4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'dx2SzD4tRhWe-F9W84B5ZPwRa0Y',
          id: 'UgzEe6cGLK5iIpglZeR4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: '👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍',
            textOriginal: '👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍👍',
            authorDisplayName: '1001dad',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLSzesEsd-vU5cV7G1KSFbi9oJx_0cRk85gJTM9e1A=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCjOK3QKgfIo0zq936EkUu3A',
            authorChannelId: {
              value: 'UCjOK3QKgfIo0zq936EkUu3A'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 0,
            publishedAt: '2021-12-25T06:57:30Z',
            updatedAt: '2021-12-25T06:57:30Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'yYebkju9-Jsm_sWyL-9cr7pNDfU',
      id: 'Ugw5P2heCijaPJ5ce654AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'F7LQysRj5q92UiIdRuH_uAXrIWg',
          id: 'Ugw5P2heCijaPJ5ce654AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: '<b>especial para você de</b> <a href="http://girlforyou.uno/">girlforyou.Uno</a> <br><br>Asi con toy y sus maN͠as no se la<br>hay nomas pa ra reirse un rato y no estar triste y estresado por la vida dura que se vive hoy..<br>Tu..belleza.viaja.al.universo.se.reune.con.estrellas.<br>y.luceros...tu.mirada.enamora.al.sol.....tu.hermosura.quedara.por..una.eternidad.en.los.corazonede.<br>tus.admiradores......feliz<br>Navidad.y.noche.buena....mis.respeto.para.todas.las.mujes.del.mundo...saludos..al.fin.del.mundo<br>🈂♂♀❤',
            textOriginal: '*especial para você de* girlforyou.Uno \n\nAsi con toy y sus maN͠as no se la\nhay nomas pa ra reirse un rato y no estar triste y estresado por la vida dura que se vive hoy..\nTu..belleza.viaja.al.universo.se.reune.con.estrellas.\ny.luceros...tu.mirada.enamora.al.sol.....tu.hermosura.quedara.por..una.eternidad.en.los.corazonede.\ntus.admiradores......feliz\nNavidad.y.noche.buena....mis.respeto.para.todas.las.mujes.del.mundo...saludos..al.fin.del.mundo\n🈂♂♀❤',
            authorDisplayName: 'Ashley_Skyy',
            authorProfileImageUrl: 'https://yt3.ggpht.com/Wov7eBmM3to6ri6ogPcCow6wJ3lra-z1ewI_bUnSqjfXLel-owJmdaNGUIgu1OJTZi5Q4rbzXUE=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCnD8wwnuzDZDhIvyNF_1mgA',
            authorChannelId: {
              value: 'UCnD8wwnuzDZDhIvyNF_1mgA'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 2,
            publishedAt: '2021-12-24T00:44:48Z',
            updatedAt: '2021-12-24T00:44:48Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    },
    {
      kind: 'youtube#commentThread',
      etag: 'xJYPN6A_KEMBe4vEP7dy9-9apHA',
      id: 'UgwwI22NWO_UvbXYg_V4AaABAg',
      snippet: {
        videoId: 'AqdAtTu8Aes',
        topLevelComment: {
          kind: 'youtube#comment',
          etag: 'YnniGgeN3mPbPIBY_2Du3NeBLPM',
          id: 'UgwwI22NWO_UvbXYg_V4AaABAg',
          snippet: {
            videoId: 'AqdAtTu8Aes',
            textDisplay: 'play this playlist,i feel like at garrison',
            textOriginal: 'play this playlist,i feel like at garrison',
            authorDisplayName: '45 Ardiansyah',
            authorProfileImageUrl: 'https://yt3.ggpht.com/ytc/AKedOLRe2i2sXF2n8wvCvWHrikcQwbrFiAbmuTGUtEIIFQ=s48-c-k-c0x00ffffff-no-rj',
            authorChannelUrl: 'http://www.youtube.com/channel/UCHnLyuPYIqTjiBZVwbNQvqA',
            authorChannelId: {
              value: 'UCHnLyuPYIqTjiBZVwbNQvqA'
            },
            canRate: true,
            viewerRating: 'none',
            likeCount: 3,
            publishedAt: '2021-12-23T08:37:06Z',
            updatedAt: '2021-12-23T08:37:06Z'
          }
        },
        canReply: true,
        totalReplyCount: 0,
        isPublic: true
      }
    }
    ]
    const ansJson = json.map(function (el) {
      const obj = {
        imgSrc: el.snippet.topLevelComment.snippet.authorProfileImageUrl,
        text: el.snippet.topLevelComment.snippet.textDisplay,
        name: el.snippet.topLevelComment.snippet.authorDisplayName,
        publishedAt: el.snippet.topLevelComment.snippet.publishedAt
      }
      return obj
    })
    //    ans = JSON.parse(json);
    res.send({ success: true, comments: ansJson })
  }, 1000)
}

module.exports = {
  search,
  mostPopular,
  searchNew,
  relatedToVideo,
  testFetch,
  mail,
  demo,
  videoComments,
  demoComments,
  videoFullData,
  videoFullDataDemo
}
