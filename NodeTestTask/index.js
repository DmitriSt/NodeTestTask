$(document).ready(function() {
  const url = "https://fe.it-academy.by/Examples/words_tree/";

  $.ajax({
    url: url + 'root.txt', 
    success: function(result){
      createFirstArray(result);
    }
  });

  const phrase = []

  function createFirstArray(data) {
    const promises = []
    if (data.match(/file/)) {
      JSON.parse(data).forEach(item => {
        const fetcha = fetch(url + item)
          .then((response) => {
            return response.text();
          })
          .then ((data) => {
            if (data.match(/file/)) {
              phrase.push(JSON.parse(data))
            } else {
              phrase.push(data)
            }
            return phrase
          })
        promises.push(fetcha)
      })
      
      Promise.allSettled(promises)
        .then ((data) => {
          return data[0];
        })
        .then((phrase) => {
          phrase.value.forEach((item, i) => {
            if (typeof item === 'object') {
             checkInnerArrays(phrase.value, item, i)
            }
          })
        })
    }
  }

  function checkInnerArrays(phrase, items, index) {
    const newArr = []
    items.forEach(item => {
      if (item.match(/file/)) {
        fetch(url + item)
          .then((response) => {
            return response.text();
          })
          .then ((data) => {
            if (data.match(/file/)) {
              newArr.push(JSON.parse(data))
            } else {
              newArr.push(data)
            }
            phrase[index] = newArr
            const updateArray = phrase.flat()
            return updateArray
          })
          .then ((phrase) => {
            phrase.forEach((item, i) => {
              if (typeof item === 'object') {
                checkInnerArrays(phrase, item, i)
              } else {
                $('#div1').text(phrase.join(' '))
              }
            })
          })
      }
    })
  }
})
