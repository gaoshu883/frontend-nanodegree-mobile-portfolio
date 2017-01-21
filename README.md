## Website Performance Optimization portfolio project

It is the [Project 6](https://github.com/udacity/frontend-nanodegree-mobile-portfolio) of Udacity's Front-End Web Developer Nanodegree, which is to optimize an [online portfolio](https://rawgit.com/udacity/frontend-nanodegree-mobile-portfolio/master/index.html) for speed.

Main tasks:
+ `index.html` achieves a `Pagespeed` score of at least 90 for Mobile and Desktop
+ `pizza.html` gets rid of jank

Here is the optimized profolio site: [http://lu3xiang.top/frontend-nanodegree-mobile-portfolio/](http://lu3xiang.top/frontend-nanodegree-mobile-portfolio/)

### Getting started

1. `git clone https://github.com/gaoshu883/frontend-nanodegree-mobile-portfolio.git`
1. Install build tools

  ```bash
  $> cd /path/to/your-project-folder
  $> npm install
  ```
1. Run a local server

  ```bash
  $> cd /path/to/your-project-folder/dist
  $> npm install httpster -g
  $> httpster
  ```
1. Open chrome browser and visit localhost:3333
1. Download and install [ngrok](https://ngrok.com/) to the top-level of your project directory to make your local server accessible remotely.

  ``` bash
  $> cd /path/to/your-project-folder
  $> ./ngrok http 3333
  ```
1. Copy the public URL ngrok gives you and try running it through [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

### Optimized parts

####Part 1: Optimize PageSpeed Insights score for index.html

**PageSpeed scores:**

 * Mobile: 90+/100
 * Desktop: 90+/100

**Optimizations:**

| Items  | Check out|
| ------------------------------------------------------ | -----------------------------------   |
| Removed google fonts                                   | `src/index.html:11`                   |
| Used media query for print.css                         | `src/index.html:17`                   |
| Moved all script tags to end of body                   | `src/index.html:64`                   |
| Added async to analytics and perfmatters script tags   | `src/index.html:73`                   |
| Included CSS inline                                    | `src/index.html` `dist/index.html`    |
| Minified all CSS, JS and HTML files                    | `dist/css` `dist/js` `dist/index.html`|
| Resized and compressed images                          | `dist/image`                          |

**Dev tools:**

* Use `gulp` to minify assets and build the project, check out `gulpfile.js` and `package.json`for more details about task runner configure and dependencies.
* Use `Timeline`(now named `Performance`) to analyze CRP.

####Part 2: Optimize Frames per Second in pizza.html

**Optimizated results:**

* Frame-rate is about 60 fps when scrolling

* Average scripting time to generate last 10 frames is ~1 ms

* Time to resize pizzas is less than 5 ms

**Optimizations:**

- Refactor `resizePizzas` --- Check out `src/js/main.js:426`
   + Deleted `determineDx` function and refactored `changePizzaSizes` function, made it easier and faster to change the pizzas' sizes
   + Used `randomPizzas` for caching DOM objects outside the for-loop
   + Fixed FSL

```JavaScript

  changeSliderLabel(size);

  // Refactors `changePizzaSizes` and remove `determineDx`
  // Iterates through pizza elements on the page and changes their widths
  function changePizzaSizes(size) {
    var newwidth;
    // Chooses different width for pizza contanier when slider moves
    switch(size) {
      case "1":
        newwidth = 25;
        break;
      case "2":
        newwidth = 33.33;
        break;
      case "3":
        newwidth = 50;
        break;
      default:
        console.log("bug in sizeSwitcher");
    }
    // Uses `randomPizzas` for caching DOM objects outside the for-loop
    // Reads DOM only once and avoid FSL
    // Uses `getElementsByClassName` instead `querySelectorAll` to read DOM faster
    var randomPizzas = document.getElementsByClassName("randomPizzaContainer");
    for (var i = 0; i < randomPizzas.length; i++) {
      randomPizzas[i].style.width = newwidth + '%';
    }
  }

  changePizzaSizes(size);

```

- Refactor `updatePositions` --- Check out `src/js/main.js:498`

  + Rewrited the for loop
  + Avoided FSL
  + Used transform for not triggering the Layout and Paint

```JavaScript

  // Uses more effecient way to read DOM faster
  var items = document.getElementsByClassName('mover');

  // Reads DOM only once outside executing the for-loop
  var dx = document.body.scrollTop / 1250;

  // There are only five different phases applied for all items, so make five items a group,
  // the first phase will be applied to the first one of each group, and so forth.
  var n = items.length / 5; // Uses n for caching the number of group outside the for-loop
  for (var i = 0; i < 5; i++) {
    var phase = Math.sin(dx + i);
    for (var j = 0; j < n; j++) {
      var itemX = items[5 * j + i].basicLeft + 100 * phase;
      // Uses transform instead left for not triggering the layout and paint
      items[5 * j + i].style.transform = 'translateX(' + itemX + 'px)';
    }
  }

```

- Use rAF to update positions of pizzas --- Check out `src/js/main.js:524`

```JavaScript

  window.addEventListener('scroll', function() {
    window.requestAnimationFrame(updatePositions);
  });

```

- Reduce the number of pizza --- Check out `src/js/main.js:532`

```JavaScript

  document.addEventListener('DOMContentLoaded', function() {
    var cols = 8;
    var s = 256;
    // Reduce the number of pizza to 25
    for (var i = 0; i < 25; i++) {
      var elem = document.createElement('img');
      elem.className = 'mover';
      elem.src = "image/pizza.png";
      elem.style.height = "100px";
      elem.style.width = "73.333px";
      elem.basicLeft = (i % cols) * s;
      elem.style.top = (Math.floor(i / cols) * s) + 'px';
      // Initializes the original X coordinate of pizzas
      elem.style.left = elem.basicLeft + 'px';
      document.querySelector("#movingPizzas1").appendChild(elem);
    }
    updatePositions();
  });

```


- Modify `.mover` styles --- Check out `src/css/view-style.css:32`

```CSS
  .mover {
    position: fixed;
    width: 256px;
    z-index: -1;
    /* Creates a layer*/
    transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
  }

```

### Optimization Tips and Tricks
* [Optimizing Performance](https://developers.google.com/web/fundamentals/performance/ "web performance")
* [Analyzing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp.html "analyzing crp")
* [Optimizing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path.html "optimize the crp!")
* [Avoiding Rendering Blocking CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css.html "render blocking css")
* [Optimizing JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript.html "javascript")
* [Measuring with Navigation Timing](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp.html "nav timing api"). We didn't cover the Navigation Timing API in the first two lessons but it's an incredibly useful tool for automated page profiling. I highly recommend reading.
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/eliminate-downloads.html">The fewer the downloads, the better</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer.html">Reduce the size of text</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization.html">Optimize images</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching.html">HTTP caching</a>

### Customization with Bootstrap
The portfolio was built on Twitter's <a href="http://getbootstrap.com/">Bootstrap</a> framework. All custom styles are in `dist/css/portfolio.css` in the portfolio repo.

* <a href="http://getbootstrap.com/css/">Bootstrap's CSS Classes</a>
* <a href="http://getbootstrap.com/components/">Bootstrap's Components</a>
