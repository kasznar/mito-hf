<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="sass">
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap')

  *
    box-sizing: border-box

  html
    background-color: #F2F2F2

  body
    font-family: 'Roboto', sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    margin: 0
    background-image: url('./assets/background.svg')
    background-size: cover

  #app
    min-height: 100vh

  // datepicker könyvtár formázása
  .vdp-datepicker input
    width: 100%
    height: 50px
    border-radius: 2px !important
    border-color: #919191 !important
    border-width: 1px
    padding: 0 10px !important
    font-size: 16px !important
    color: #343434 !important
    border-style: solid

  .vdp-datepicker::before
    content: ""
    position: absolute
    top: 13px
    right: 10px
    width: 24px
    height: 24px
    background-image: url("./assets/calendar-incon.svg")

  .vdp-datepicker__calendar
    width: 100% !important

  // multiselect könyvtár formázása
  .multiselect__tags
    height: 50px
    border-radius: 2px !important
    border-color: #919191 !important
    padding: 3px 10px !important
    display: flex !important
    flex-wrap: wrap
    align-items: center !important

  .search-select__picker--arrival .multiselect__tags::before
    content: "DESTINATION"

  .search-select__picker--departure .multiselect__tags::before
    content: "DEPARTURE"

  .search-select__picker--filled .multiselect__tags::before
    color: #919191
    font-size: 10px
    font-weight: bolder

  .multiselect__placeholder
    color: #919191 !important
    margin: 0 !important
    padding: 0 !important
    font-size: 16px !important

  .multiselect__select
    display: none !important

  .multiselect__single
    padding: 0 !important
    margin: 0 !important

  .search-select__picker--error
    .multiselect__tags
      background-color: #FFF2FA !important
      border-color: #C6007E !important
      border-width: 2px !important
      border-radius: 3px !important
      box-shadow: 0 0 10px 0 rgba(198, 0, 126, 0.35)

    .multiselect__input
      background-color: #FFF2FA !important
      box-shadow: none

    & input
      background-color: #FFF2FA !important
      border-color: #C6007E !important
      border-width: 2px !important
      border-radius: 3px !important
      box-shadow: 0 0 10px 0 rgba(198, 0, 126, 0.35)
</style>
