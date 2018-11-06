var table = document.getElementById("table");
var homeBlock = document.getElementById("home");
var formBlock = document.getElementById("form");
var baseBlock = document.getElementById("baza-danych");
var menuHome = document.getElementById("menu-home");
var menuETL = document.getElementById("menu-etl");
var menuBD = document.getElementById("menu-bd");
var etlBtn = document.getElementById("etl-btn");
var eBtn = document.getElementById("e-btn");
var tBtn = document.getElementById("t-btn");
var lBtn = document.getElementById("l-btn");

function tableDisplay(){
    table.classList.remove('display-none');
}

function homePage(){
    homeBlock.classList.remove('display-none');
    formBlock.classList.add('display-none');
    baseBlock.classList.add('display-none');
    table.classList.add('display-none');
    menuHome.classList.add('active');
    menuETL.classList.remove('active');
    menuBD.classList.remove('active');
}

function etlPage(){
    formBlock.classList.remove('display-none');
    homeBlock.classList.add('display-none');
    baseBlock.classList.add('display-none');
    menuHome.classList.remove('active');
    menuETL.classList.add('active');
    menuBD.classList.remove('active');
}

function basePage(){
    baseBlock.classList.remove('display-none');
    formBlock.classList.add('display-none');
    homeBlock.classList.add('display-none');
    table.classList.add('display-none');
    menuBD.classList.add('active');
    menuHome.classList.remove('active');
    menuETL.classList.remove('active');
}
