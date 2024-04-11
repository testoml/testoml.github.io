var sortBy = (function () {
    var toString = Object.prototype.toString,
        // default parser function
        parse = function (x) { return x; },
        // gets the item to be sorted
        getItem = function (x) {
          var isObject = x != null && typeof x === "object";
          var isProp = isObject && this.prop in x;
          return this.parser(isProp ? x[this.prop] : x);
        };
        
    /**
     * Sorts an array of elements.
     *
     * @param {Array} array: the collection to sort
     * @param {Object} cfg: the configuration options
     * @property {String}   cfg.prop: property name (if it is an Array of objects)
     * @property {Boolean}  cfg.desc: determines whether the sort is descending
     * @property {Function} cfg.parser: function to parse the items to expected type
     * @return {Array}
     */
    return function sortby (array, cfg) {
      if (!(array instanceof Array && array.length)) return [];
      if (toString.call(cfg) !== "[object Object]") cfg = {};
      if (typeof cfg.parser !== "function") cfg.parser = parse;
      cfg.desc = !!cfg.desc ? -1 : 1;
      return array.sort(function (a, b) {
        a = getItem.call(cfg, a);
        b = getItem.call(cfg, b);
        return cfg.desc * (a < b ? -1 : +(a > b));
      });
    };
    
  }());

function fetchJSONData() {
    fetch("./resources/data/articles.json", {mode:'no-cors'})
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => 
           {
                data.reverse((a, b) => a.date - b.date);
                const placeholder = document.querySelector(".blog-post");
                const recentPost = document.querySelector("#recentPost");
                data.forEach(item => {
                    placeholder.insertAdjacentHTML("beforeend", `<h3>${item.title}</h3>
                    <p class="blog-post-meta">${item.date} - <a href="${item.linkReposity}">Repository</a></p>
                    <p>${item.description}</p>
                    <span class="badge text-bg-primary rounded-pill">${item.tags}</span>
                    <p></p>`);
                });

                /*for (let i = 0; i < 2; i++) {
                    recentPost.insertAdjacentHTML("beforeend", `
                     <li>
                     <a class="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top"
                       href="#">
                       <rect width="100%" height="100%" fill="#777" />
                       <div class="col-lg-8">
                         <h6 class="mb-0">${data[i].title}</h6>
                         <small class="text-body-secondary">${data[i].data}</small>
                       </div>
                     </a>
                   </li>`);
                }*/
           }     
         )
        .catch((error) => 
               console.error("Unable to fetch data:", error));
}
fetchJSONData();