showNoResultsOnPage();

function showNoResultsOnPage() {
  let $elem = $( '#is-results-container' );
  
  $elem.append(
    $('<div/>', {'id': 'no-container'}).append(
      $('<h1/>', {'id': 'no-title', 'text': 'No results yet..'}),
      $('<p/>', {
        'id': 'no-text', 
        'text': 'Use the filters above to find the plant that best fits your environment :)'
      }),
      $('<img/>', {
        'src': './assets/illustrations/no-results.png',
        'id': 'no-img',
        'alt': 'no-results'
      })
    )
  );
}

function showResultsOnPage(data) {
  let $elem = $( '#is-results-container' );

  $elem.append(
    $('<div/>', {'id': 'results-container'}).append(
      $('<img/>', {
        'src': './assets/illustrations/pick.png',
        'id': 'results-header-img',
        'alt': 'pick'
      }),
      $('<h1/>', {
        'id': 'results-title', 
        'text': 'Our picks for you'}),
      $('<div/>', {'class': 'splide'}).append(
        $('<div/>', {'class': 'splide__track'}).append(
          $('<ul/>', {
            'class': 'splide__list',
            'id': 'show-results-list'
          })
        )
      )
    )
  );



  $.each(data, function(key, value){

    let sunIcon, waterIcon, petsIcon, displayValue;
    console.log('data', data);


    // Look for icons
    if (value.sun === 'high') {
      sunIcon = './assets/icons/high-sun.svg'
    } else if (value.sun === 'low') {
      sunIcon = './assets/icons/low-sun.svg'
    } else {
      sunIcon = './assets/icons/no-sun.svg'
    }

    if (value.water === 'daily') {
      waterIcon = './assets/icons/3-drops.svg'
    } else if (value.water === 'regularly') {
      waterIcon = './assets/icons/2-drops.svg'
    } else {
      waterIcon = './assets/icons/1-drop.svg'
    }
    if (value.toxicity === false) {
      petsIcon = './assets/icons/pet.svg'
    } else {
      petsIcon = './assets/icons/toxic.svg'
    }

    // Get staff favorite display
    if (value.staff_favorite === true) {
      displayValue = 'block'
    } else {
      displayValue = 'none'
    }
    console.log('displayValue', displayValue);

    let $elem = $( '.splide__list' );

    $elem.append(
      $('<li/>', {'class': 'splide__slide'}).append(
        $('<div/>', {'class': 'plant-container'}).append(
          $('<div/>', {
            'class': 'staff-favorite',
            'style': {'display': displayValue}
          }).append(
            $('<div/>', {'class': 'staff-text-box'}).append(
              $('<span/>', {'text': '✨'}),
              $('<p/>', {'text': 'Staff favorite'})
            )
          )
        ).append(
          $('<div/>', {'class': 'plant-img-container'}).append(
            $('<img/>', {
              'src': value.url,
              'class': 'plant-img',
              'alt': value.name
            })
          )
        ).append(
          $('<div/>', {'class': 'plant-name'}).append(
            $('<p/>', {'text': value.name})
          )
        ).append(
          $('<div/>', {'class': 'plant-price'}).append(
            $('<p/>', {'text': value.price})
          )
        ).append(
          $('<img/>', {
            'src': petsIcon,
            'id': 'plant-icon-pets',
            'alt': 'pet'
          }),
          $('<img/>', {
            'src': sunIcon,
            'id': 'plant-icon-sun',
            'alt': 'sun'
          }),
          $('<img/>', {
            'src': waterIcon,
            'id': 'plant-icon-water',
            'alt': 'water'
          })
        )
      )
    )
  });

  // Create splide
  new Splide( '.splide', {
    type   : 'slide',
    rewind: false,
    speed: 800,
    // width: '100%',
    fixedWidth: '258px',
    fixedHeight: '321px',
    // height: '100%',
    padding: {
      right: 27,
      left : 35,
    },
    gap: '1rem',
    arrows: false,
    pagination: false,
    perPage: 1,
  } ).mount();
}

function search() {  
  let data = [];
  let sun, water, pets;
  
  if (document.querySelector("input[name=sunlight]:checked")) {
    sun = document.querySelector("input[name=sunlight]:checked").value;
  }
  
  if (document.querySelector("input[name=water]:checked")) {
    water = document.querySelector("input[name=water]:checked").value;
  }
  
  if (document.querySelector("input[name=pets]:checked")) {
    pets = document.querySelector("input[name=pets]:checked").value;
  }
  
  if (!sun || !water || !pets) { return }
  
  const myUrlWithParams = new URL("https://front-br-challenges.web.app/api/v2/green-thumb/");
  
  myUrlWithParams.searchParams.append("sun", sun);
  myUrlWithParams.searchParams.append("water", water);
  myUrlWithParams.searchParams.append("pets", pets);
  
  let url = myUrlWithParams.href
  console.log('url', url);
  
  async function getDatafromApi(url) {
    data = await fetch(url)
    .then(response => response.json())
    .catch(function(error) {
      alert(error.message);
    });

    $( '#is-results-container' ).empty();
    
    if (data !== []) {
      showResultsOnPage(data);
    } else {
      showNoResultsOnPage();
    }
  }
  
  getDatafromApi(url);
};
