(function (iwErrors) {
  let hasErrors = false,
    data = null,
    errors = null,
    errerrBody = null,
    list = null,
    openState = false,
    /**
     * View object to return DOM elements
     */
    view = {
      error: (item) => {
        let err = document.createElement("DIV");
        let icon = document.createElement("DIV");
        let details = document.createElement("DIV");
        let name = document.createElement("H4");
        let description = document.createElement("P");

        err.className = "error";
        icon.className = "error-icon fas fa-upload";
        details.className = "error-details";
        name.className = "error-name";
        description.className = "error-description";

        name.textContent = item.name;
        description.textContent = item.description;

        details.append(name, description);
        err.append(icon, details);

        return err;
      },
    },
    /**
     * Chek if there are errors stored in localStorage
     */
    checkErrors = () => {
      if (localStorage.getItem("iwErrors") !== null) {
        hasErrors = true;
        data = JSON.parse(localStorage.getItem("iwErrors"));
      }
    },
    /**
     * Show new error
     * @param {obj} err
     */
    show = (err) => {
      if (hasErrors) {
        data.errors.push(err);
        localStorage.setItem("iwErrors", JSON.stringify(data));
        removeDOMErrors();
        renderErrors();
      } else {
        let obj = {};
        obj.errors = [];
        obj.errors.push(err);
        localStorage.setItem("iwErrors", JSON.stringify(obj));
        checkErrors();
        renderErrors();
      }
    },
    /**
     *
     */
    remove = (name) => {
      let i = null;

      console.log(data);

      data.errors.forEach((item, index) => {
        if (item.name === name) {
          i = index;
        }
      });

      data.errors.splice(i, 1);

      if (data.errors.length === 0) {
        dismissErrors();
        return;
      }

      localStorage.setItem("iwErrors", JSON.stringify(data));

      removeDOMErrors();
      renderErrors();
    };
  /**
   * Remove Errors from the document
   */
  (removeDOMErrors = () => {
    document.getElementById("errors").remove();
  }),
    /**
     * Render existing errors
     */
    (renderErrors = () => {
      errors = document.createElement("DIV");
      let header = document.createElement("DIV");
      let alert = document.createElement("SPAN");
      let title = document.createElement("H2");
      let expand = document.createElement("SPAN");
      let close = document.createElement("BUTTON");
      errBody = document.createElement("DIV");
      list = document.createElement("UL");

      let numErrs = data.errors.length;

      errors.className = "errors";
      errors.id = "errors";
      header.className = "errors-header";
      alert.className = "header-alert fas fa-exclamation-triangle";
      title.className = "header-title";
      expand.className = "header-expand fas fa-chevron-down";
      close.className = "header-close fas fa-times";
      errBody.className = "errors-body";
      list.className = "errors-list";

      title.textContent = `${numErrs} error(s)`;
      header.append(alert, title, expand, close);

      // Loop through errors to render list
      data.errors.map((item) => {
        list.appendChild(view.error(item));
      });

      errBody.append(list);
      errors.append(header, errBody);

      document.body.appendChild(errors);
      expand.addEventListener("click", toggleExpand);
      close.addEventListener("click", dismissErrors);
    }),
    /**
     *
     */
    (toggleExpand = () => {
      let listHeight = list.offsetHeight;
      errBody.setAttribute("data-height", listHeight + "px");
      if (openState) {
        errBody.style.height = `0px`;
        openState = false;
        if (errors.classList.contains("active")) {
          errors.classList.remove("active");
        }
      } else {
        errBody.style.height = `${listHeight}px`;
        openState = true;
        if (!errors.classList.contains("active")) {
          errors.classList.add("active");
        }
      }
    }),
    /**
     *
     * @param {*} err
     */
    (appendError = (err) => {
      list.appendChild(view.error(err));
    }),
    /**
     *
     */
    (dismissErrors = () => {
      localStorage.removeItem("iwErrors");
      data = null;
      hasErrors = false;
      document.querySelector(".errors").remove();
    }),
    /**
     * Kick in logic
     */
    (init = () => {
      checkErrors();

      if (hasErrors) {
        renderErrors();
      }
    });

  iwErrors.show = show;
  iwErrors.remove = remove;

  window.addEventListener("DOMContentLoaded", init);
})((window.iwErrors = window.iwErrors || {}));
