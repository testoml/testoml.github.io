const output = document.querySelector('.output');
const url = "https://docs.google.com/spreadsheets/d/"
const ssid = "1tsKoTo-Gg2RUc5h5SJD0YBFLRh0SbnmmGeiftxKBonw";
const query1 = `/gviz/tq?`; //visualization data
const query2 = 'tqx=out:json';
//Elements
const content = document.querySelector('.experience')
const contentEducation = document.querySelector('.education')
const contentSkill = document.querySelector('.skill')

//Allow get table from google sheet
function getTable(endpoint) {
    const table = fetch(endpoint)
        .then(res => res.text())
        .then(data => {
            const temp = data.substring(47).slice(0, -2);
            const json = JSON.parse(temp);
            return json.table
        }).catch((error) => {
            console.log(error)
        });

    return table
}


function load(sheet) {
    const query3 = `sheet=${sheet}`;
    const select = `select *`
    const query4 = encodeURIComponent(select);
    var rows = []
    var cols = []
    var table= []
    const endpoint = `${url}${ssid}${query1}&${query2}&${query3}&tq=${query4}`;
    getTable(endpoint).then(data => {
        data.rows.forEach((row) => {
            rows.push(row.c)
        });
        data.cols.forEach((col) => {
            cols.push(col.label)
        })
        //console.log(rows)
        //console.log(cols)
        for (let i = 0; i < rows.length; i++) {
            let obj = {}
            for (let j = 0; j < cols.length; j++) {
                if (rows[i][j] === null) {
                    obj[cols[j]] = 'S/D'
                } else {
                    obj[cols[j]] = rows[i][j].v
                }

            }

            table.push(obj);
        }
    })
    const data = new Promise((resolve, reject) => {
        setTimeout(() => {
           
            resolve(table);
            if (table.length === 0) {
                reject(new Error('There are not data'))
            }

        }, 500);
    });
    return data
}


function getData(ms, sheet) {
  
}


function loadCard(div, date, company, position, description) {
    let card = createElement(div, 'div', 'card bd-gray-300 mb-3', '')
    let cardBody = createElement(card, 'div', 'card-body resume-wrap ftco-animate fadeInUp ftco-animated', '')
    createElement(cardBody, 'span', 'date', `${date}`)
    createElement(cardBody, 'h2', 'card-title', `${company}`)
    createElement(cardBody, 'span', 'position', `${position}`)
    createElement(cardBody, 'p', 'mt-4', `${description}`)
}


async function fetchData() {
    
    var obj = {}
    try {
         obj.load = await load('Load')
         obj.education = await load('Education')
         obj.experience = await load('Experience')
         obj.aditional =  await load('Aditional')
         console.log(obj)
        const presentationDiv = document.querySelector('#presentation')
        obj.load.forEach(item => {
            createElement(presentationDiv, `${item.Tag}`, `${item.Css}`, `${item.Description}`)
        })
         //Show Experience
        showExperience(obj.experience)
        //Show Education
        showEducation(obj.education)
        //Show Skill
        showSkill(obj.aditional)

    } catch (error) {
        console.log(error.message)
    }
}

fetchData()

function showTitle(parent, text, subText){
    insertElement(parent, `<div class=" heading-section text-center ftco-animate fadeInUp ftco-animated">
          	<h1 class="big big-2">${text}</h1>
            <h2 class="mb-4">${text}</h2>
            <p>${subText}</p>
          </div>`)
}

function showExperience(data){
    showTitle(content, "Experience", "")
    const row = createElement(content, `div`, `row my-5`, ``)
    const div1 = createElement(row, `div`, `col-sm-6 mb-3 mb-sm-0`, ``)
    const div2 = createElement(row, `div`, `col-sm-6`, ``)

    data.forEach(item => {
        if (item.Id % 2 !== 0) {
            loadCard(div1, item.Date, item.Company, item.Position, item.Experience)
        } else {
            loadCard(div2, item.Date, item.Company, item.Position, item.Experience)
        }
    })

}

function showEducation(data){
     showTitle(content, "Education", "")
     const rowEducation = createElement(contentEducation, `div`, `row my-5`, ``)
     const divEducation1 = createElement(rowEducation, `div`, `col-sm-6 mb-3 mb-sm-0`, ``)
     const divEducation2 = createElement(rowEducation, `div`, `col-sm-6`, ``)
     data.forEach(item => {
         if (item.Id % 2 !== 0) {
             loadCard(divEducation1, item.Date, item.School, item.Degree, item.Description)
         } else {
             loadCard(divEducation2, item.Date, item.School, item.Degree, item.Description)
         }
     })
}

function showSkill(data){
        //variables
        var skill = []
        skill = data.filter(d => d.Sheet === "Skill")
        showTitle(contentSkill, "Skills", "")
        const rowSkill = createElement(contentSkill, `div`, `row my-5`, ``)
        const divSkill1 = createElement(rowSkill, `div`, `col-sm-6 mb-3 mb-sm-0 animate-box`, ``)
        const divSkill2 = createElement(rowSkill, `div`, `col-sm-6 animate-box`, ``)
        skill.forEach(item => {
            if (item.Id % 2 !== 0) {
               progressBar(divSkill1, item.Name, item.Avarage)
            } else {
               progressBar(divSkill2, item.Name, item.Avarage)
            }
        })
}


function progressBar(parent, name, avarage){
    insertElement(parent,  `
        <div class="progress-wrap ftco-animate fadeInUp ftco-animated">
            <h3>${name}</h3>
            <div class="progress">
                 <div class="progress-bar color-1" role="progressbar" aria-valuenow="${avarage}" aria-valuemin="0" aria-valuemax="100" style="width:${avarage}%">
                <span>${avarage}%</span>
                  </div>
            </div>
        </div>
    `)


       
}



function showPage() {
    var education = []
    var skill = []
    var experience = []
    var loadInformation = []
    load('Education').then((data) => { education = data.filter(d => d.Sheet === "Education") })
    load('Aditional').then((data) => { skill = data.filter(d => d.Sheet === "Skill") })
    load('Experience').then((data) => { experience = data.filter(d => d.Sheet === "Experience") })
    load('Load').then((data) => {
        loadInformation = data.filter(d => d.Sheet === "Load")
        const content = document.querySelector('.experience')
        const contentEducation = document.querySelector('.education')
        const contentSkill = document.querySelector('.skill')
        //Load - Personal Presentation
        const presentationDiv = document.querySelector('#presentation')
        loadInformation.forEach(item => {
            createElement(presentationDiv, `${item.Tag}`, `${item.Css}`, `${item.Description}`)
        })
        //Experience
        createElement(content, `h2`, `text-center fs-1 mb-3`, `Experience`)
        const row = createElement(content, `div`, `row`, ``)
        const div1 = createElement(row, `div`, `col-sm-6 mb-3 mb-sm-0`, ``)
        const div2 = createElement(row, `div`, `col-sm-6`, ``)

        experience.forEach(item => {
            if (item.Id % 2 !== 0) {
                loadCard(div1, item.Date, item.Company, item.Position, item.Experience)
            } else {
                loadCard(div2, item.Date, item.Company, item.Position, item.Experience)
            }
        })
        //Education
        createElement(contentEducation, `h2`, `text-center fs-1 mb-3`, `Education`)
        const rowEducation = createElement(contentEducation, `div`, `row`, ``)
        const divEducation1 = createElement(rowEducation, `div`, `col-sm-6 mb-3 mb-sm-0`, ``)
        const divEducation2 = createElement(rowEducation, `div`, `col-sm-6`, ``)
        education.forEach(item => {
            if (item.Id % 2 !== 0) {
                loadCard(divEducation1, item.Date, item.School, item.Degree, item.Description)
            } else {
                loadCard(divEducation2, item.Date, item.Company, item.Position, item.Description)
            }
        })
        //skill
        createElement(contentSkill, `h2`, `text-center fs-1 mb-3`, `Skills`)
        const rowSkill = createElement(contentSkill, `div`, `row`, ``)
        const divSkill1 = createElement(rowSkill, `div`, `col-sm-6 mb-3 mb-sm-0`, ``)
        const divSkill2 = createElement(rowSkill, `div`, `col-sm-6`, ``)
        skill.forEach(item => {
            if (item.Id % 2 !== 0) {
                insertElement(divSkill1, `
                <h3>${item.Name}</h3>
                <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="${item.Avarage}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: ${item.Avarage}%">${item.Avarage}%</div>
                </div>`)
            } else {
                insertElement(divSkill2, `
                    <h3>${item.Name}</h3>
                    <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="${item.Avarage}" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" style="width: ${item.Avarage}%">${item.Avarage}%</div>
                    </div>`)
            }
        })
    })
}

//showPage()


function createElement(parent, element, css, text) {
    const el = document.createElement(`${element}`)
    el.className = css
    el.innerHTML = text
    if (typeof parent === 'string') {
        document.querySelector(`${parent}`).appendChild(el)
    } else {
        parent.appendChild(el)
    }
    return el;
}

function insertElement(parent, element) {
    const el = parent.insertAdjacentHTML('beforeend', `${element}`);
    return el;
}




