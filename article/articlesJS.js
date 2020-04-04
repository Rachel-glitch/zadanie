

function opinionToHtml(opinion) {

    opinion.createdDate=(new Date(opinion.created)).toDateString();
    //opinion.willReturnMessage=opinion.willReturn?"I will return to this page":"Sorry, one visit was enough";

    const template = document.getElementById("myTemplate").innerHTML;
    const htmlWOp = Mustache.render(template,opinion);

    delete(opinion.createdDate);
    //delete(opinion.willReturnMessage);

    return htmlWOp;

}

function opinionArrayToHtml(sourceData) {
    return sourceData.reduce((htmlWithOpinions,opn) => htmlWithOpinions+opinionToHtml(opn), "");
}

let opinions=[];
const opinionsElm=document.getElementById("opinionsContainer");

if(localStorage.myFlowers){
    opinions=JSON.parse(localStorage.myFlowers)
}

opinionsElm.innerHTML=opinionArrayToHtml(opinions);

let comFrmElm = document.getElementById("kvetyForm");

comFrmElm.addEventListener("submit", processOpnFrmData);

function clearData(){

    const oneDay = 1000*60*60*24;
    //const date = (Date.now() - new Date(opinions[0].created))/oneDay;
    const date = Date.now();

    for(let i=0; i<opinions.length; i++){
        if(Date.now()-new Date(opinions[i].created) > date){
            opinions.splice(i,1);
        }
    }

    opinionsElm.innerHTML=opinionArrayToHtml(opinions);
    localStorage.myFlowers = JSON.stringify(opinions);

}



function processOpnFrmData(event) {
    event.preventDefault();

    const name = document.getElementById("nameElm").value.trim();
    const email = document.getElementById("emailElm").value.trim();
    const url = document.getElementById("urlElm").value.trim();
    const opn = document.getElementById("opnElm").value.trim();
    const theme1 = document.getElementById("interestedIn").checked;
    const theme2 = document.getElementById("interestedIn2").checked;
    const theme3 = document.getElementById("interestedIn3").checked;
    const rating = document.getElementById("kvetyForm").elements["hodnotenie"];

    if (name == "" || opn == "" || email == "") {
        window.alert("Please, enter your name, email and opinion");
        return;
    }



    const newOpinion =
        {
            name: name,
            email: email,
            url: url,
            comment: opn,
            the1: theme1?"Zaujima tema kvetov":"",
            the2: theme2?"Zaujima tema pestovania":"",
            the3: theme3?"Zaujima tema kytic a ich pestovania":"",
            rating: rating.value==1?"Hodnotenie:vyborna":"hodnotenie:priemerna",
            created: new Date()
        };


    opinions.push(newOpinion);
    localStorage.myFlowers = JSON.stringify(opinions);

    opinionsElm.innerHTML+=opinionToHtml(newOpinion);

    comFrmElm.reset();
}