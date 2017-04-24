"use strict;"
//DECLARATIONS
let $masterList = $('.student-list');
let totalStudents; // number of students in the list
let pageCounter = 0; //page counter
let pageHeader = $('.page-header');
let mainPage = $('.page'); // main page
let numPages; // number of pages tbd
let originalPagesNumber;
let searchBar;
let $input;
let message = $('<p>Not found. Please try again.</p>').addClass('message'); // when there is no match
mainPage.append(message); //append to the end of the page
message.hide();

//FUNCTIONS
function displayHolder(){
    searchBar = $('<div></div>').addClass('student-search');
    $input = $('<input placeholder="Search for students...">');
    $button = $('<button>Search</button>');
    searchBar.append($input);
    searchBar.append($button);
    pageHeader.append(searchBar);

    for(var i=0; i<$masterList.children().length; i++){
        $('.student-list li').eq(i).hide();
    }
    //loops through list until 10 students are shown
    for(var i=0; i<10; i++){
        $('.student-list li').eq(i).show();
    }
    paginationFunction($masterList.children().length); // call paginationFunction function
}

function paginationFunction(totalStudents){
    pageCounter++;
    numPages = Math.ceil(totalStudents/10); //calculates # of pgs required

    if(pageCounter <= 1){
        originalPagesNumber = numPages;
    }

    //create new list that contains the number of pages and adds pagination class
    let pagesList = $('<ul></ul>').addClass('pagination');
    mainPage.append(pagesList); // append the new list to main

    //instantiates list items and pages
    //appends links to list items, adds list items to list
    for(var i=0; i<numPages; i++){
        let page = $('<li></li>');
        let link = $('<a href="#">'+ (i+1) +'</a>');
        page.append(link);
        pagesList.append(page);
    }
    $('.pagination li a').first().addClass('active');
    $('.pagination li a').click(studentsPerPage);
}

function getIndex(pageNumber){
    let blockCounter = 0;
    for(var i = 0; i < $masterList.children().length; i++){
        if($('.student-list li').eq(i).hasClass('block')){
            blockCounter++;
            }
            if(blockCounter > (pageNumber - 1) * 10){
                return($('.student-list li').eq(i).index());
                break;
            }
        }
}

//function below displays 10 students per page before search and after
function studentsPerPage(){
    $('.pagination li a').removeClass('active'); //removes active class from all links by default
    $(this).addClass('active');

    let blockCounter = 0; //list item counter
    let pageNumber = parseInt($(this).text()); //parse page #
    let start = (pageNumber * 10) - 10;
    let end = pageNumber * 10;


    // if condition checks for search event
    if($('.pagination').children().length < originalPagesNumber){
        let index = getIndex(pageNumber); // get the index of the first block element
        for(var i=0; i<$masterList.children().length; i++){ // hide all students
            $('.student-list li').eq(i).hide();

        }
        for(var i = index; i < $masterList.children().length; i++){
            if($('.student-list li').eq(i).hasClass('block')){
                blockCounter++;
                $('.student-list li').eq(i).css('display', 'block');
            }
            if(blockCounter > 10){
                $('.student-list li').eq(i).hide();
            }
        }

    }else{ // if no search then, hide all and display based on the page number.
        for(var i=0; i<$masterList.children().length; i++){
            $('.student-list li').css('display', 'none');
        }

        for(var i = start; i < end; i++){
            $('.student-list li').eq(i).css('display', 'block');
        }
    }
}

function search(){
    let counter = 0; //match counter
    let noMatch = 0; //non-match counter
    let studentsNames = $('.student-list li h3');
    let studentsEmails = $('.student-list li .email');

    for(var i=0; i<$masterList.children().length; i++){
        let n = $('.student-list li .email').eq(i).text().indexOf('@'); //index of @
        let email = $('.student-list li .email').eq(i).text().substring(0, n);

        //conditional responsible for checking accuracy of input value
        if(studentsNames.eq(i).text().indexOf($input.val().toLowerCase()) !== -1 || email.indexOf($input.val().toLowerCase()) !== -1){

            $('.student-list li').eq(i).css('display', 'block');// display if input matches
            counter++;
        }else{
            noMatch++;
            $('.student-list li').eq(i).css('display', 'none');
        }
    }

    if(noMatch === $masterList.children().length){
        message.show();
    }else{
        message.hide();
    }

    if(counter > 10){ // if number of matches > 10 then, remove the original pages.
        $('.pagination').detach();
        paginationFunction(counter); //counter = number of students
        studentsPerPageSearch(); // this function is the initial display after the search which displays the first 10 students after the search.
    }else{ // if matches less than 10 then,
        $('.pagination').hide(); //hide number of pages
        studentsPerPageSearch();
    }

    if($input.val().length === 0){ //blanks input field if no entry has been made
        $('.pagination').detach();
        paginationFunction($masterList.children().length);
    }
}

//resulting display of 10 students after search has been used
function studentsPerPageSearch(){
    var blockCounter = 0;

    for(var i=0; i<$masterList.children().length; i++){
             $('.student-list li').eq(i).removeClass('block');
    }

    for(var i=0; i<$masterList.children().length; i++){
        if($('.student-list li').eq(i).css('display') === 'block'){
             $('.student-list li').eq(i).addClass('block');
        }
    }

    for(var i=0; i<$masterList.children().length; i++){
        if($('.student-list li').eq(i).css('display') === 'block'){
            blockCounter++;
        }

        if(blockCounter > 10){
            $('.student-list li').eq(i).hide();
        }
    }
}

displayHolder();
$('input').on('keyup', search);
