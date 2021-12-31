const { json } = require('body-parser');
const {logger} = require('../utils/logger');
const youtubeSearch = require('youtube-search-without-api-key');
const {google} = require('googleapis');
const ytDurationFormat = require('youtube-duration-format');
const Fetch = require('../service/Fetch');
const sendMail = require('../service/MailService');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');

const service = google.youtube({
    version : 'v3',
    auth : process.env.API_KEY
}) 
  
const search = async (req, res) => {
    console.log('in youtuber')
    try {
        let str = req.body.str;
        let videos = await youtubeSearch.search(str);
        
        videos = videos.map(function(element){
            let obj = {
                videoId: element.id.videoId,
                   url : element.snippet.thumbnails.url,
                    title : element.title,
                   publishedAt:element.snippet.publishedAt,
                   duration:element.snippet.duration,
                   views:element.views};
        return obj;
        }); 
        res.send({success: true, videos: videos});
        logger.info({message:{ step:'end',name: 'youtube', time:new Date()}});
    } catch (e) {
        console.log('in youtuber catch')
        // logger.error({route: 'sendCampaign', error: e.message});
        res.send({success: false, error: e.message});
    }
};

const most_popular = async (req, res) => {
    console.log('in google youtuber')
    try {
        let str = req.body.str;
        const ans = await service.videos.list({
            "part" : ["snippet , contentDetails , statistics"],
            "chart" : "mostPopular",
            "videoCategoryId": 20,
            "regionCode": "IL",
            "maxResults" : 40
        });
        let videos = ans.data.items.map(function(element){
            let obj = {
                videoId: element.id,
                url : element.snippet.thumbnails.medium.url,
                title : element.snippet.title,
                publishedAt:element.snippet.publishedAt.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/, "$3/$2/$1"),
                duration:ytDurationFormat(element.contentDetails.duration),
                views:element.statistics.viewCount};
        return obj;
        });
        res.send({success: true, videos:videos});
        logger.info({message:{ step:'end',name: 'youtube', time:new Date()}});
    } catch (e) {
        console.log('in youtuber catch')
        // logger.error({route: 'sendCampaign', error: e.message});
        res.send({success: false, error: e.message});
    }
};

const search_new = async (req, res) => {
    console.log('in google youtuber')
    try {
        let str = req.body.str;
        const ans = await service.search.list({
            "part" : ["snippet"],
            "q" : str,
            "maxResults" : 20
        });
        let videos = ans.data.items
        let new_videos = [];
        videos.forEach((item, index)=>{
            let video_data = service.videos.list({
                "part" : ["snippet , contentDetails , statistics"],
                "id" : item.id.videoId
            });
            new_videos.push(video_data);
        });
        Promise.all(new_videos).then(data => {

        let final_ans = data.map(function(element){
            let obj = {
                videoId : element.data.items[0].id,
                url : element.data.items[0].snippet.thumbnails.high.url,
                title : element.data.items[0].snippet.title,
                publishedAt:element.data.items[0].snippet.publishedAt.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/, "$3/$2/$1"),
                duration:ytDurationFormat(element.data.items[0].contentDetails.duration),
                views:element.data.items[0].statistics.viewCount};
        return obj;
        });

        
        // let final_ans = data.map(function(element){
        // return element.data.items[0];
        // });
            res.send({success: true, videos:final_ans});
          });
        logger.info({message:{ step:'end',name: 'youtube', time:new Date()}});
    } catch (e) {
        console.log('in youtuber catch')
        // logger.error({route: 'sendCampaign', error: e.message});
        res.send({success: false, error: e.message});
    }
};

const test_fetch = async (req, res) => { Fetch({req, res, endPoint: `wikipedia/search-on-wikipedia`, method: 'POST'})};

const mail = async (req, res) => {
    try {
        const from = req.body.from;
        const to = req.body.to;
        const subject = req.body.subject;
        const text = req.body.text;
        await sendMail({from, to ,subject ,text});
        res.send({success: true, message:"mail send"});
    } catch (e) {
        logger.error({route: 'mail', error: e.message});
        res.send({success: false, error: e.message});
    }
};

module.exports = {
    search,
    most_popular,
    search_new,
    test_fetch,
    mail
};