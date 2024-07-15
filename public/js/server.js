const output = document.querySelector('.output');
const url = "https://docs.google.com/spreadsheets/d/"
const ssid = "1tsKoTo-Gg2RUc5h5SJD0YBFLRh0SbnmmGeiftxKBonw";
const query1 = `/gviz/tq?`; //visualization data
const query2 = 'tqx=out:json';
//Elements
const content = document.querySelector('.experience')
const contentEducation = document.querySelector('.education')
const contentSkill = document.querySelector('.skill')
const cv = document.querySelector('#cv')
const menu = document.querySelector('#ftco-nav')

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
    var table = []
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



function loadCard(div, date, company, position, description) {
    //let card = createElement(div, 'div', 'card bd-gray-300 mb-3', '')
    let cardBody = createElement(div, 'div', 'card-body resume-wrap ftco-animate fadeInUp ftco-animated', '')
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
        obj.aditional = await load('Aditional')
        obj.project = await load('Project')
        console.log(obj)
        showMenu(obj.aditional)
        //Show header presentation
        showHeader(obj.load)
        showAbout(obj.aditional)
        //Show Experience
        showExperience(obj.experience)
        //Show Education
        showEducation(obj.education)
        //Show Skill
        showSkill(obj.aditional)
        //Show Tools
        showTools(obj.aditional)
        //show Project
        showProject(obj.project)

    } catch (error) {
        console.log(error.message)
    }
}

fetchData()

function showMenu(data) {
    const ul = createElement(menu, 'ul', 'navbar-nav nav ml-auto', '')
    //li
    const li = filterByCategories(data, 'Menu')
    li.forEach(item => {
        insertElement(ul, `<li class="nav-item"><a href="${item.Link}" class="nav-link"><span>${item.Name}</span></a></li>`)
    })
}

function showTitle(parent, text, subText) {
    insertElement(parent, `<div class=" heading-section text-center ftco-animate fadeInUp ftco-animated">
          	<h1 class="big big-2">${text}</h1>
            <h2 class="mb-4">${text}</h2>
            <p>${subText}</p>
          </div>`)
}

function showHeader(data) {
    ancle(cv, 'home')
    const presentationDiv = createElement(cv, 'div', 'px-4 py-5 my-5 text ', '')
    data.forEach(item => {
        if(item.Tag === 'a'){
            insertElement(presentationDiv, `<a class="${item.Css}" href="${item.Link}">${item.Description}</a>`)
        } else {
            createElement(presentationDiv, `${item.Tag}`, `${item.Css}`, `${item.Description}`)
        }
        
    })
}


function showAbout(data) {
    ancle(cv, 'about')
    const section = createElement(cv, 'section', 'ftco-section contact-section ftco-no-pb my-5', '') 
    showTitle(section, "About Me", "Throughout my career, I have specialized in Selenium automation with C#, integrating seamlessly with SQL Server in Azure environments. Additionally, I possess proficiency in utilizing tools such as Postman, Cypress, and JMeter to drive automation initiatives and ensure comprehensive test coverage.")
    const about = filterByCategories(data,'About')
    //const div = createElement(section, 'div', 'd-flex contact-info mb-5', '')
    const containContact = createElement(section, 'div', 'row d-flex contact-info mb-5', '')
    about.forEach(item => {
        insertElement(containContact, `<div class="col-md-6 col-lg-3 d-flex ftco-animate fadeInUp ftco-animated">
            <div class="align-self-stretch box p-4 text-center">
                <div class="icon d-flex align-items-center justify-content-center">
          			<span class="${item.Icon}"></span>
          		</div>
                <h3 class="mb-4">${item.Name}</h3>
              <p><a href="${item.Link}">${item.Description}</a></p>
            </div>
        </div>`)
    })

}

function showExperience(data) {
    ancle(cv, "experience")
    const section = createElement(cv, 'section', 'ftco-section ftco-no-pb my-5', '')
    showTitle(section, "Experience", "")
    const row = createElement(section, `div`, `row my-5`, ``)
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

function showEducation(data) {
    ancle(cv, "education")
    const section = createElement(cv, 'section', 'ftco-section ftco-no-pb my-5', '')
    showTitle(section, "Education", "")
    const rowEducation = createElement(section, `div`, `row my-5`, ``)
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


function filterByCategories(data, filter) {
    var list = []
    list = data.filter(d => d.Categories === filter)
    return list
}

function showSkill(data) {
    ancle(cv, "skills")
    const skill = filterByCategories(data, "Skill")
    const section = createElement(cv, 'section', 'ftco-section ftco-no-pb my-5', '')
    showTitle(section, "Skills", "")
    const rowSkill = createElement(section, `div`, `row my-5`, ``)
    skill.forEach(item => {
        const div = createElement(rowSkill, `div`, `col-md-6 animate-box`, ``)
        progressBar(div, item.Name, item.Avarage)


    })
}

function showTools(data) {
    ancle(cv, "tools")
    const tools = filterByCategories(data, "Tool")
    const section = createElement(cv, 'section', 'ftco-section ftco-no-pb my-5', '')
    showTitle(section, "Tools", "")
    boxTool(tools)
}

function showProject(data) {
    ancle(cv, "projects")
    const section = createElement(cv, 'section', 'ftco-section ftco-no-pb my-5', '')
    showTitle(section, "Projects", "")
    boxProject(data)
}

function progressBar(parent, name, avarage) {
    insertElement(parent, `
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


function boxTool(data) {
    const div = createElement(cv, 'div', 'row', '')
    data.forEach(item => {
        insertElement(div, `<div class="col-md-4 text-center d-flex ftco-animate fadeInUp ftco-animated">
            <a href="#" class="services-1">
                <span class="icon">
                    <img src="${item.Link}" height="${item.Avarage}"/>
                </span>
                <div class="desc">
                    <h3 class="mb-5">${item.Name}</h3>
                </div>
            </a>
        </div>
`)
    })
}

function boxProject(data) {
    const div = createElement(cv, 'div', 'row d-flex', '')
    data.forEach(item => {
        insertElement(div, `<div class="col-md-4 d-flex ftco-animate fadeInUp ftco-animated">
          	<div class="blog-entry justify-content-end">       
              <div class="text mt-3 float-right d-block">
              	<div class="d-flex align-items-center mb-3 meta">
	                <p class="mb-0">
	                	<span class="mr-2">${item.Date}</span>
	                </p>
                </div>
                <h3 class="heading"><a href="${item.Link}">${item.Title}</a></h3>
                <p>${item.Description}</p>
              </div>
            </div>
          </div>
     `)
    })
}

function ancle(parent, name) {
    insertElement(parent, `<a name="${name}"></a>`)
}


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




