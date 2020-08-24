window.addEventListener('DOMContentLoaded', function() {
    var 
    contentBox = document.querySelector('.content-boxes'),
    searchRequest = document.querySelector('.finde-line'),
    sendBtn = document.querySelector('.btn--submit'),
    pageItems = document.querySelector('.pagination-quantity-page > p > span'),
    paginationControl = document.querySelectorAll('.pagination-control-arrow > a'),
    pageInLow = document.querySelector('.pagination-items > p :nth-child(1)'),
    pageInHi = document.querySelector('.pagination-items > p :nth-child(2)'),
    pageInAll = document.querySelector('.pagination-items > p :nth-child(3)'),
    taskMessage = '', // Should contain a movie request
    quantity = 1, // Counter for pagimation
    allPage = 0,
    itemPage = 0,
    itemsPerPage = 10,
    upCall = 1;

    //API request function
    var HttpClient = function() {
        this.get = function(aUrl, aCallback) {
            var anHttpRequest = new XMLHttpRequest();
            anHttpRequest.onreadystatechange = function() { 
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
            }
    
            anHttpRequest.open( "GET", aUrl, true );            
            anHttpRequest.send( null );
        }
    }

    // init API request function
    RequestResult = function(movie, quantity) {
      var client = new HttpClient();
        client.get('https://www.omdbapi.com/?apikey=aca90435&page=' + quantity + '&s=' + encodeURI(movie), function(response) {
        //console.log(response);
        var objMovie = JSON.parse(response);
        CounterBuild(objMovie);
        
      });
    };  
    // Make a movie card in HTML
    function CounterBuild(count){

        contentBox.innerHTML = '';
    
        if (count.Response === 'False'){

            let contentItem = document.createElement('div');
            contentItem.classList.add('content-item-text');
            let notFoundMovie = document.createElement('h2');
            notFoundMovie.classList.add('notFound');
            notFoundMovie.innerHTML = 'Sorry your ' + count.Error;
            contentItem.appendChild(notFoundMovie);
            contentBox.appendChild(contentItem);
            pageItems.innerHTML =  '0';
            pageInAll.innerHTML = '0';
            pageInHi.innerHTML = '0';
            pageInLow.innerHTML = '0';

        } if (count.Response === 'True'){
            pageItems.innerHTML =  count.Search.length;
            itemPage = +count.Search.length;
            pageInAll.innerHTML = count.totalResults;
            allPage = +count.totalResults;
            pageInLow.innerHTML = upCall;
            pageInHi.innerHTML = upCall + count.Search.length - 1;
             
        for (let i = 0; i <= count.Search.length; i++){


            let contentItem = document.createElement('div');
            contentItem.classList.add('content-item');

            let imgPoster = document.createElement('img');
            imgPoster.classList.add('img-pos');
            if (count.Search[i].Poster !== 'N/A'){
                imgPoster.src = count.Search[i].Poster;
            } else {
                imgPoster.src ='./assets/Image/Image/image-not-found.png'
            } 
            let titleMovieWrap = document.createElement('div');
            titleMovieWrap.classList.add('content-title');
            let titleMovie = document.createElement('h2');
            titleMovie.innerHTML = count.Search[i].Title;
            
            let movieDescriprion = document.createElement('div');
            movieDescriprion.classList.add('content-description');

            let movieTypeWrap = document.createElement('div');
            movieTypeWrap.classList.add('movie-type');
            let movieType = document.createElement('h5');
            movieType.innerHTML = count.Search[i].Type;

            let movieYearWrap = document.createElement('div');
            movieYearWrap.classList.add('movie-year');
            let movieYear =  document.createElement('h5');
            movieYear.innerHTML = count.Search[i].Year;
            
            movieTypeWrap.appendChild(movieType);
            movieYearWrap.appendChild(movieYear);
            movieDescriprion.appendChild(movieTypeWrap);
            movieDescriprion.appendChild(movieYearWrap);
            titleMovieWrap.appendChild(titleMovie);

            contentItem.appendChild(imgPoster);
            contentItem.appendChild(titleMovieWrap);
            contentItem.appendChild(movieDescriprion);
            contentBox.appendChild(contentItem);
        };
        };

    };
    // Push movie request to server
    function SearchMovie (event) {
        event.preventDefault();
        if (event.type === 'keyup') {
            taskMessage = event.target.value;
        }
        if (event.keyCode === 13 && event.type === 'keyup' && taskMessage.trim() || event.type === 'click' && taskMessage.trim()) {   
            
            quantity = 1;
            allPage = 0,
            itemPage = 0;
            upCall = 1;
            RequestResult(taskMessage,quantity);
            searchRequest.value = '';
        }
    }
    //Event for movie request
    function Events () {
        searchRequest.addEventListener('keyup', SearchMovie);
        sendBtn.addEventListener('click',SearchMovie);
        
    }
    // Pagination maker 
    function PaginationMover(element){
        element.preventDefault();
            if (element.target.classList.contains('next')){
                if (Math.ceil(allPage/itemsPerPage) > quantity ){
                  quantity++;
                  upCall = upCall + itemsPerPage;
                  RequestResult(taskMessage,quantity);
                } else {return};
            } if (element.target.classList.contains('prev')) {
                
                if (quantity <=1){
                    quantity = 1;  
                   RequestResult(taskMessage,quantity);
                  } else {
                    quantity--;
                    upCall = upCall - itemsPerPage;
                    RequestResult(taskMessage,quantity);
                 };
                
              };
    };
    // Event to clic arrow pagination
    function EventsClickArrow () {
        paginationControl.forEach(function (item) {
          item.addEventListener('click', PaginationMover);
        });
        
    };
        
    Events();
    EventsClickArrow(); 
 
});