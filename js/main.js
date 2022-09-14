"use strict";

let freshIdeasObject = {
   completed: [],
   achievements: {},
};


function saveFreshIdeasInStorage(){
   localStorage.setItem('freshIdeasObject', JSON.stringify(freshIdeasObject));
}

// the main logic of application
// get data from server
const chooseIdeasList    = document.querySelector('.choose-ideas__row');
const myIdeasList        = document.querySelector('.slider__body');
const myIdeasListWrapper = document.querySelector('.slider__wrapper');


async function query(){
   const link = 'https://api.github.com/repos/drewthoennes/Bored-API/contents/db/activities.json';

   for (let i = 0; i < 4; i++){
      let query = await fetch(link, {
         method: 'GET',
      });

      let queryToJson                = await query.json();
      let decodingData               = window.atob(queryToJson.content);
      let decodingDataRemoveBrackets = decodingData.split('').map(function (e, i , arr){
         if (e === '"')return e = '';

         return e;
      }).join('');

      let activitiesArr = [];

      let activitie = decodingDataRemoveBrackets.match(/{[^}]+}/g);

      for (let i = 0; i < activitie.length; i++) {
          let segments = activitie[i].split(',');
          let item = {};
          for (let j = 0; j < segments.length; j++) {
              let pair = segments[j].replace(/{|}/, '').replace('"', '').split(':');
              item[pair[0].trim()] = pair[1];
          }
          activitiesArr.push(item);    
      }

      let currentActivitie = activitiesArr[Math.floor(Math.random() * activitiesArr.length)];

      let template = `<div class="choose-ideas__column idea__column" data-text="${currentActivitie['activity']}" data-title="${currentActivitie.type}">
                        <article class="choose-ideas__item idea__item">
                           <header class="choose-ideas__header idea__header">
                              <h5 class="choose-ideas__title idea__title title-h5">${currentActivitie.type}</h5>
                           </header>
                           <p class="choose-ideas__text idea__text text">
                           ${currentActivitie.activity}
                           </p>
                           <button class="choose-ideas__button idea__button text focus-borderradius-50" title="add in my list" type="button">
                              <svg class="idea__icon icon__plus" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M22 10.3196H11.6804V0H10.3196V10.3196H0V11.6804H10.3196V22H11.6804V11.6804H22V10.3196Z" fill="white"/>
                              </svg>
                              <svg class="idea__icon icon__mark" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M7.7214 22C7.33861 22.0006 6.96064 21.9077 6.61566 21.7284C6.27069 21.549 5.9676 21.2878 5.72899 20.9642L0.141761 13.4021C0.0241786 13.2109 -0.022724 12.9789 0.0103336 12.752C0.0433913 12.5252 0.154001 12.32 0.320277 12.1771C0.486554 12.0343 0.696383 11.964 0.908249 11.9804C1.12012 11.9968 1.31858 12.0985 1.46438 12.2655L7.05161 19.8184C7.13398 19.9346 7.24089 20.0278 7.36339 20.0902C7.48589 20.1525 7.62043 20.1823 7.75574 20.1769C7.89105 20.1715 8.0232 20.1311 8.14113 20.0592C8.25906 19.9873 8.35934 19.8859 8.43359 19.7634L20.4474 0.404457C20.5098 0.304549 20.5897 0.218895 20.6827 0.152388C20.7756 0.0858799 20.8798 0.0398205 20.9892 0.0168392C21.0987 -0.00614208 21.2112 -0.00559566 21.3205 0.0184481C21.4297 0.0424919 21.5335 0.089562 21.6259 0.15697C21.7183 0.224379 21.7975 0.310805 21.859 0.411316C21.9206 0.511827 21.9632 0.624453 21.9844 0.742764C22.0057 0.861075 22.0052 0.982754 21.9829 1.10085C21.9607 1.21895 21.9172 1.33116 21.8548 1.43107L9.84947 20.7809C9.6261 21.142 9.32678 21.4407 8.97604 21.6526C8.6253 21.8645 8.23312 21.9835 7.83162 22H7.7214Z" fill="white"/>
                              </svg>
                              <span class="idea__button-text idea__button-text-add">Add to my list</span>
                              <span class="idea__button-text idea__button-text-completed">Completed</span>
                           </button>
                        </article>
                     </div>`

      if (i === 0){
         chooseIdeasList.innerHTML = template;
      } else {
         chooseIdeasList.innerHTML += template;
      }
   }
};
query();
// set listener for query function on button

const queryBtn = document.querySelector('.choose-ideas__get-new-ideas');

function queryOnClick(){
   query();
}

queryBtn.addEventListener('click', queryOnClick);

// set listener on chooseIdeasList, delegation of events for buttons
function addIdeaToMyList(e){
   let t              = e.target;
   let tClosestButton = t.closest('.idea__button');
   
   if (tClosestButton){
      let closestColumn  = tClosestButton.closest('.idea__column');
      tClosestButton.title = 'make idea complete';
      myIdeasList.prepend(closestColumn);

      removeHolderFromMyList();
      disabledSliderBnts();
      sliderCounter();
      itemActive();
      
      myIdeasList.removeAttribute('style');
      sliderCurrentActiveItem = 0;
      sliderBodyPosition      = 0;
      sliderCounter();
      localStorage.setItem('myList-fi', myIdeasList.innerHTML)
   }
}

// check our list on emptiness

function removeHolderFromMyList(){
   if (myIdeasList.querySelector('.idea__column')){
      myIdeasListWrapper.classList.remove('_empty');
   }
}

// give _active class for first item and remove from other
function itemActive(){
   for (let item of myIdeasList.children){
      item.firstElementChild.classList.remove('_active');
   }
   if (myIdeasList.children.length){
      myIdeasList.children[0].firstElementChild.classList.add('_active');
   }
}

chooseIdeasList.addEventListener('click', addIdeaToMyList);

// burger menu

const burgerBtn  = document.querySelector('.burger-btn');
const burgerMenu = document.querySelector('.header__menu');

burgerBtn.addEventListener('click', (e) => {
   burgerBtn.classList.toggle('_active');
   document.body.classList.toggle('_lock');
   burgerMenu.classList.toggle('_active');
})

function closeMenu(e){
   let t = e.target;
   let closestLink = t.closest('.menu__list-link');

   if (closestLink){
      burgerBtn.classList.remove('_active');
      document.body.classList.remove('_lock');
      burgerMenu.classList.remove('_active')
   }
}

burgerMenu.addEventListener('click', closeMenu)
// slider

const sliderBtns    = document.querySelectorAll('.my-list__btn');
const sliderBody    = document.querySelector('.slider__body');
const sliderWrapper = document.querySelector('.slider__wrapper');

let sliderNumberOfSlidesToShow = 3;
let sliderCurrentActiveItem    = 0;
let sliderBodyPosition         = 0;

// try to imitate media queries and change amount of slider items

function checkResize(){
   if (document.body.clientWidth <= 1140) sliderNumberOfSlidesToShow = 2;
   if (document.body.clientWidth <= 780)  sliderNumberOfSlidesToShow = 1;
}

window.addEventListener('resize', checkResize);

const sliderColumns       = sliderBody.querySelectorAll('.idea__column');
const sliderColumnWidth   = sliderColumns.length ? sliderColumns[0].clientWidth : '';
const sliderItems         = sliderBody.querySelectorAll('.idea__item');
const sliderWrapperWidth  = sliderWrapper.clientWidth;
const sliderBodyFullWidth = sliderColumnWidth * sliderColumns.length;

sliderColumns.length ? sliderItems[0].classList.add('_active') : null;

// check our slider on amount of slides and change disabled status of slider buttons
function disabledSliderBnts(){
   for (let btn of sliderBtns){
      if (myIdeasList.children.length <= 1){
         btn.disabled = true;
      } else {
         btn.disabled = false;
      }
   }
}

// check amound of slides and change slider counter status
function sliderCounter(){
   let currentSlide  = document.querySelector('.slider__counter-current');
   let allItemsSlide = document.querySelector('.slider__counter-all');

   currentSlide.innerHTML  = myIdeasList.children.length ? sliderCurrentActiveItem + 1 : 0;
   allItemsSlide.innerHTML = myIdeasList.children.length;
}

sliderBtns.forEach( btn => {
   btn.addEventListener('click', e => {
      let target = e.target.closest('.my-list__btn').dataset.action;
      if (target === 'previous'){
         if (sliderCurrentActiveItem !== myIdeasList.children.length - 1 || sliderNumberOfSlidesToShow === 1){
            if (sliderBodyPosition){
               sliderBodyPosition += myIdeasList.children[0].clientWidth;
               sliderBody.style.left = sliderBodyPosition+'px';
            }
         }
         if (sliderCurrentActiveItem > 0){
            sliderCurrentActiveItem--;
         }
      }
      
      if (target === 'next'){
         if (sliderCurrentActiveItem !== 0 || sliderNumberOfSlidesToShow === 1){
            if (sliderBodyPosition > -(myIdeasList.children.length * myIdeasList.children[0].clientWidth - myIdeasList.children[0].clientWidth * sliderNumberOfSlidesToShow)){
               sliderBodyPosition -= myIdeasList.children[0].clientWidth;
               sliderBody.style.left = sliderBodyPosition+'px';
            }
         }  
         if (sliderCurrentActiveItem < myIdeasList.children.length - 1){
            sliderCurrentActiveItem++;
         }
      }

      sliderCounter();

      for (let item of myIdeasList.children){
         item.firstElementChild.classList.remove('_active');
      }
      
      myIdeasList.children[sliderCurrentActiveItem].firstElementChild.classList.add('_active');
   })
})

// set listener on myList, delegation of events for buttons
const completedTable        = document.querySelector('.completed-table tbody');
const completedTableWrapper = document.querySelector('.completed__table-wrapper');
const achievements          = document.querySelector('.achievements__row');

function completeTask(e){
   let t = e.target;
   let closestBtn = t.closest('.idea__button');

   if (closestBtn){
      let closestColumn = closestBtn.closest('.idea__column');
      let templateTitle = closestColumn.dataset.title;

      // add item to achievements section

      if (!achievements.querySelector(`.achievements__column[data-title="${templateTitle}"]`)){
         freshIdeasObject.achievements[templateTitle] = 1;
         let teplateAchievements = `<div class="achievements__column" data-title="${templateTitle}">
                                       <article class="achievements__item achievement">
                                          <header class="achievement__header">
                                             <h3 class="achievement__title title-h3">${templateTitle}</h3>
                                          </header>
                                          <p class="achievement__counter">${freshIdeasObject.achievements[templateTitle]}</p>
                                       </article>
                                    </div>`;
         achievements.innerHTML += teplateAchievements;
      } else {
         freshIdeasObject.achievements[templateTitle]++;
         achievements.querySelector(`.achievements__column[data-title="${templateTitle}"] .achievement__counter`).innerHTML++;
      }
      
      // add item to completed challenges section
      let templateText  = closestColumn.dataset.text.split('');
      templateText.length = 20

      let date     = new Date();
      let day      = ('0' + (date.getDate())).slice(-2);;
      let month    = ('0' + (date.getMonth() + 1)).slice(-2);
      let year     = date.getFullYear();
      let hours    = date.getHours();
      let minutes  = ('0' + (date.getMinutes())).slice(-2);

      freshIdeasObject.completed.push([templateText.join(''), templateTitle, day+'.'+month+'.'+year+' - '+hours+':'+minutes]);

      let templateCompleted = `<tr>
                        <td>${freshIdeasObject.completed.length}</td>
                        <td>${templateText.join('') + '...'}</td>
                        <td class="completed-table-item__title">${templateTitle}</td>
                        <td>${day+'.'+month+'.'+year+' - '+hours+':'+minutes}</td>
                     </tr>`;
      completedTable.innerHTML += templateCompleted;
   
      saveFreshIdeasInStorage();
   
      // remove element and make basic actions
      closestColumn.remove();

      addHolderForMyList();
      removeAchievementsHolder();
      removeCompletedHolder();
      disabledSliderBnts();
      sliderCounter();
      itemActive();
      
      myIdeasList.removeAttribute('style');
      sliderCurrentActiveItem = 0;
      sliderBodyPosition      = 0;
      sliderCounter();

      localStorage.setItem('achievements-fi', achievements.innerHTML);
      localStorage.setItem('completed-fi', completedTable.innerHTML);
      localStorage.setItem('myList-fi', myIdeasList.innerHTML);
   }
   
}
// functions helpers for check sections on emptiness
function addHolderForMyList(){
   if (!myIdeasList.querySelector('.idea__column')){
      myIdeasListWrapper.classList.add('_empty');
   }
}

function removeAchievementsHolder(){
   if (achievements.querySelector('.achievements__column')){
      achievements.classList.remove('_empty');
   }
}

function removeCompletedHolder() {
   if (completedTable.querySelector('tr')){
      completedTableWrapper.classList.remove('_empty');
   }
}

myIdeasList.addEventListener('click', completeTask)

// get data from localStorage

myIdeasList.innerHTML                                    = localStorage.getItem('myList-fi');
completedTable.innerHTML                                 = localStorage.getItem('completed-fi');
let achievementsFromLocalStorage                         = localStorage.getItem('achievements-fi')
if (achievementsFromLocalStorage) achievements.innerHTML = achievementsFromLocalStorage;
let freshIdeasObjectFromLocalStorage                     = localStorage.getItem('freshIdeasObject');
if (freshIdeasObjectFromLocalStorage) freshIdeasObject   = JSON.parse(freshIdeasObjectFromLocalStorage);

// launch some functions for reload data
disabledSliderBnts();
sliderCounter();
removeHolderFromMyList();
removeAchievementsHolder();
removeCompletedHolder();
