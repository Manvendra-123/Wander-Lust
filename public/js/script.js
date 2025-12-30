// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


   //star rating logic
  const stars = document.querySelectorAll(".gl-star-rating--stars span");
  const select = document.querySelector(".gl-star-rating select");

  let selectedRating = 0;

  function highlightStars(value, className) {
    stars.forEach((star) => {
      star.classList.remove("hover", "active");
      if (star.dataset.value <= value) {
        star.classList.add(className);
      }
    });
  }

  // Hover preview
  stars.forEach((star) => {
    star.addEventListener("mouseover", () => {
      highlightStars(star.dataset.value, "hover");
    });

    star.addEventListener("mouseout", () => {
      highlightStars(selectedRating, "active");
    });

    // Click selection
    star.addEventListener("click", () => {
      selectedRating = star.dataset.value;
      select.value = selectedRating;
      highlightStars(selectedRating, "active");
    });
  });


  