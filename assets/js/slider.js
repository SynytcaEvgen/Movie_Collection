window.addEventListener('DOMContentLoaded', function() {
    
    var MultiItemSlider = (function () {
        return function (selector) {
          var
            mainElement = document.querySelector(selector),
            sliderWrapper = mainElement.querySelector('.slider-wrapper'), 
            sliderItems = mainElement.querySelectorAll('.slider-item'), 
            sliderControls = mainElement.querySelectorAll('.slider-control'), 
            wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width), 
            itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width),   
            positionLeftItem = 0, // position left active element 
            transform = 0, // value tramsformation .slider-wrapper
            step = itemWidth / wrapperWidth * 100, // step size for transformation
            items = []; // array
    
          sliderItems.forEach(function (item, index) {
            items.push({ item: item, position: index, transform: 0 });
          });
          
          var position = {
            getItemMin: function () {
              var indexItem = 0;
              items.forEach(function (item, index) {
                if (item.position < items[indexItem].position) {
                  indexItem = index;
                }
              });
              return indexItem;
            },
            getItemMax: function () {
              var indexItem = 0;
              items.forEach(function (item, index) {
                if (item.position > items[indexItem].position) {
                  indexItem = index;
                }
              });
              return indexItem;
            },
            getMin: function () {
              return items[position.getItemMin()].position;
            },
            getMax: function () {
              return items[position.getItemMax()].position;
            }
          }
  
          var TransformItem = function (direction) {
            if (direction === 'left') {
                positionLeftItem++;
              if ((positionLeftItem + wrapperWidth / itemWidth - 1) >= position.getMax()) {
                nextItem = position.getItemMin();
                items[nextItem].position = position.getMax() + 1;
                items[nextItem].transform += items.length * 100;
                items[nextItem].item.style.transform = 'translateX(' + items[nextItem].transform + '%)';
            }
              transform -= step;
            }
            if (direction === 'right') {
              positionLeftItem--;
              if (positionLeftItem <= position.getMin()) {
                nextItem = position.getItemMax();
                items[nextItem].position = position.getMin() - 1;
                items[nextItem].transform -= items.length * 100;
                items[nextItem].item.style.transform = 'translateX(' + items[nextItem].transform + '%)';             
              }
              transform += step;
            }
            sliderWrapper.style.transform = 'translateX(' + transform + '%)';
          }
  
          // Handler event click for button "rigth" and "left"
          var ControlClick = function (e) {
            if (e.target.classList.contains('slider-control')) {
              e.preventDefault();
              var direction = e.target.classList.contains('slider-control-left') ? 'right' : 'left';
              TransformItem(direction);
            }
          };
  
          var SetUpListeners = function () {
            // add to button  "rigth" и "left" function ControlClick for event click
            sliderControls.forEach(function (item) {
              item.addEventListener('click', ControlClick);
            });
          }
  
          // init
          SetUpListeners();

  
          return {
            right: function () { // method right
              TransformItem('right');
            },
            left: function () { // method left
              TransformItem('left');
            }
          }
  
        }
      }());
  
      var slider = MultiItemSlider('.slider')
    
          

    })