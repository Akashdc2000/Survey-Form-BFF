const axios = require('axios')


const Headers = {
    'x-tenant-id': '63f72bbaf9dfbe6751b8878c',
    'Content-Type': 'application/json'
}


//Save Response 
const saveResponse = async (request, response) => {

    var surveyData;
    var flag = true;
    await axios.get('https://api.qa.gessa.io/cms/response/?page=0&size=10', { headers: Headers })
        .then(responseObj => {
            responseObj.data.result.data.forEach(form => {
                if (form.email === request.body.email && form.survey_title === request.body.survey_title && form.survey_id===request.params.survey_id) {
                    flag = false;
                    response.status(409).json({ message: "You have already Submitted Response for the same Survey..." })
                }
            });
        })


    if (flag) {

        request.body.survey_id = request.params.survey_id;
        await axios.post('https://api.qa.gessa.io/cms/response', request.body
            , {
                headers: Headers
            },)
            .then(responseObj => {
                surveyData = responseObj.data;
                console.log("Response Recorded Successfully...")
            })
            .catch(error => {
                response.send(error);
            });

        response.status(200).json({ message: "Response Recorded Successfully..." });
    }

}



//Get All Responses By Survey_id
const getResponses = async (request, response) => {

    var surveyData;
    await axios.get('https://api.qa.gessa.io/cms/response/?page=0&size=10'
        , {
            headers: Headers
        })
        .then(responseObj => {
            surveyData = responseObj.data.result.data;
        })
        .catch(error => {
            response.send(error);
        });
    surveyData=surveyData.filter(response=>{
        return(response.survey_id===request.params.survey_id)
    })
    response.status(200).json({
        totalResponses:surveyData.length,
        responses:surveyData
    });
}



//Get Response by Response By (Single response fetched)

const getResponseByResponseId=async(request,response)=>{
    var surveyData;
    await axios.get('https://api.qa.gessa.io/cms/response/?page=0&size=10'
        , {
            headers: Headers
        })
        .then(responseObj => {
            surveyData = responseObj.data.result.data;
        })
        .catch(error => {
            response.send(error);
        });

    surveyData=surveyData.filter(response=>{
        return(response._id===request.params.response_id)
    })

    response.status(200).json(surveyData[0]);

}


module.exports = {
    saveResponse,getResponses,getResponseByResponseId
}