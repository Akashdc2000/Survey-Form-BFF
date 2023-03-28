const axios = require('axios');
const { request } = require('express');


const Headers = {
    'x-tenant-id': '63f72bbaf9dfbe6751b8878c',
    'Content-Type': 'application/json'
}


//Get All Survey By Email Address..
const surveyByEmail = async (request, response) => {

    var surveyData;
    await axios.get('https://api.qa.gessa.io/cms/survey/?page=0&size=10'
        , {
            headers: Headers
        })
        .then(responseObj => {
            surveyData = responseObj.data.result.data;
        })
        .catch(error => {
            response.send(error);
        });

    completedSurvey = await total_Completed(surveyData, request.params.email);
    totalSurvey = await total_Survey(surveyData, request.params.email);
    draftSurvey = await total_Draft(surveyData, request.params.email);
    ongoingSurvey = await total_Ongoing(surveyData, request.params.email);

    response.status(200).json({
        totalSurvey: totalSurvey.length,
        totalOngoingSurvey: ongoingSurvey.length,
        totalDraftSurvey: draftSurvey.length,
        totalCompletedSurvey: completedSurvey.length,

        survey: totalSurvey
    });

}


//Get Survey By Survey ID...

const surveyBySurveyId = async (request, response) => {

    var surveyData;
    await axios.get('https://api.qa.gessa.io/cms/survey/?page=0&size=10'
        , {
            headers: Headers
        })
        .then(responseObj => {
            surveyData = responseObj.data.result.data;
        })
        .catch(error => {
            response.send(error);
        });
    surveyData = surveyData.filter(form => {
        return form._id == request.params._id;
    })

    let status = await statusOfSurvey(surveyData[0]);
    if (status === "Null")
        response.status(404).json({ msg: "No Survey Id Given..." });
    else {
        surveyData[0].status = status;
        response.status(200).json(surveyData);
    }
}

//Get No of Survey of a user by its email
const surveyCount = async (request, response) => {

    var surveyData;
    await axios.get('https://api.qa.gessa.io/cms/survey/?page=0&size=10'
        , {
            headers: Headers
        })
        .then(responseObj => {
            surveyData = responseObj.data.result.data;
        })
        .catch(error => {
            response.send(error);
        });
    surveyData = surveyData.filter(form => {
        return form.email == request.params.email;
    })
    response.status(200).json({ "totalSurvey": surveyData.length });

}


//Get Total No of Completed Survey By Email 

const surveyCompleted = async (request, response) => {

    var surveyData;
    await axios.get('https://api.qa.gessa.io/cms/survey/?page=0&size=10'
        , {
            headers: Headers
        })
        .then(responseObj => {
            surveyData = responseObj.data.result.data;
        })
        .catch(error => {
            response.send(error);
        });


    completedSurvey = await total_Completed(surveyData, request.params.email);
    totalSurvey = await total_Survey(surveyData, request.params.email);
    draftSurvey = await total_Draft(surveyData, request.params.email);
    ongoingSurvey = await total_Ongoing(surveyData, request.params.email);

    response.status(200).json({
        totalSurvey: totalSurvey.length,
        totalOngoingSurvey: ongoingSurvey.length,
        totalDraftSurvey: draftSurvey.length,
        totalCompletedSurvey: completedSurvey.length,

        survey: completedSurvey
    });

}


//Get Total No of Ongoing Survey By Email

const surveyOngoing = async (request, response) => {

    var surveyData;
    await axios.get('https://api.qa.gessa.io/cms/survey/?page=0&size=10'
        , {
            headers: Headers
        })
        .then(responseObj => {
            surveyData = responseObj.data.result.data;
        })
        .catch(error => {
            response.send(error);
        });

    completedSurvey = await total_Completed(surveyData, request.params.email);
    totalSurvey = await total_Survey(surveyData, request.params.email);
    draftSurvey = await total_Draft(surveyData, request.params.email);
    ongoingSurvey = await total_Ongoing(surveyData, request.params.email);

    response.status(200).json({
        totalSurvey: totalSurvey.length,
        totalOngoingSurvey: ongoingSurvey.length,
        totalDraftSurvey: draftSurvey.length,
        totalCompletedSurvey: completedSurvey.length,

        survey: ongoingSurvey
    });

}




//Get Total No of Draft Survey By Email

const surveyDraft = async (request, response) => {

    var surveyData;
    await axios.get('https://api.qa.gessa.io/cms/survey/?page=0&size=10'
        , {
            headers: Headers
        })
        .then(responseObj => {
            surveyData = responseObj.data.result.data;
        })
        .catch(error => {
            response.send(error);
        });


    completedSurvey = await total_Completed(surveyData, request.params.email);
    totalSurvey = await total_Survey(surveyData, request.params.email);
    draftSurvey = await total_Draft(surveyData, request.params.email);
    ongoingSurvey = await total_Ongoing(surveyData, request.params.email);

    response.status(200).json({
        totalSurvey: totalSurvey.length,
        totalOngoingSurvey: ongoingSurvey.length,
        totalDraftSurvey: draftSurvey.length,
        totalCompletedSurvey: completedSurvey.length,

        survey: draftSurvey
    });

}


//Create a New Survey Form
const createSurvey = async (request, response) => {

    // Headers['x-tenant-id']=request.headers['x-tenant-id'];

    var surveyData;
    var flag = true;
    await axios.get('https://api.qa.gessa.io/cms/survey/?page=0&size=10', { headers: Headers })
        .then(responseObj => {
            responseObj.data.result.data.forEach(form => {
                if (form.email === request.body.email && form.survey_title === request.body.survey_title) {
                    flag = false;
                    response.status(409).json({ message: "You have already Created Survey of same title..." })
                }
            });
        })


    if (flag) {
        await axios.post('https://api.qa.gessa.io/cms/survey', request.body
            , {
                headers: Headers
            },)
            .then(responseObj => {
                surveyData = responseObj.data;
                console.log("Survey Created Successfully...")
            })
            .catch(error => {
                response.send(error);
            });
        console.log(request.body)

        response.status(200).json(surveyData);
    }

}



module.exports = {
    surveyCount,
    surveyByEmail,
    surveyBySurveyId,
    surveyCompleted,
    surveyOngoing,
    surveyDraft,

    createSurvey
}




//Helper Functions
//1.

const total_Completed = async (surveyData, email) => {

    surveyData = await surveyData.filter(form => {

        if (form.email === email) {

            let expiry_date = (new Date(form.expiry_date));
            let current_date = new Date();
            let result = (current_date > expiry_date) && (form.draft !== "true");
            if (result)
                form.status = 'Completed';
            return result;
        }
    })

    return surveyData;
}

//2.

const total_Ongoing = async (surveyData, email) => {

    surveyData = await surveyData.filter(form => {

        if (form.email === email) {

            let expiry_date = (new Date(form.expiry_date));
            let current_date = new Date();
            let result = (current_date <= expiry_date) && (form.draft !== "true");
            if (result)
                form.status = 'Ongoing';
            return result;
        }
    })

    return surveyData;
}

//3.

const total_Draft = (surveyData, email) => {

    surveyData = surveyData.filter(form => {
        if (form.email === email) {

            if (form.draft === "true")
                form.status = "Draft";

            return form.draft === "true";
        }

    })
    return surveyData;

}

//4.

const total_Survey = async (surveyData, email) => {

    surveyData = await surveyData.filter(form => {
        return form.email === email;
    })
    return surveyData;

}



const statusOfSurvey = async (survey) => {

    if (!survey) {
        return "Null";
    }
    let expiry_date = (new Date(survey.expiry_date));
    let current_date = new Date();

    if ((current_date <= expiry_date) && (survey.draft !== "true"))
        return "Ongoing";
    else if ((current_date > expiry_date) && (survey.draft !== "true"))
        return "Completed";
    else
        return "Draft";
}
