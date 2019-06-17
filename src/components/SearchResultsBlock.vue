<template>
  <div class="search-results">
    <div class="search-results-header">
      <div class="search-results-header__title">{{ title }}</div>
      <div class="search-results-header-city">
        <div class="search-results-header-city__name">{{ fromName }}</div>
        <img class="search-results-header-city__arrow" alt="From to" src="../assets/arrow_right.svg">
        <div class="search-results-header-city__name">{{ toName }}</div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SearchResultsBlock',
  props: ['title', 'fromName', 'toName']
}
</script>

<style lang="sass" scoped>
  .search-results
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)
    background-color: white

  .search-results-header
    display: flex
    flex-wrap: wrap
    align-items: center
    background-color: #F2F2F2
    padding: 0.5rem

  .search-results-header__title
    font-size: 18px
    color: #919191
    width: 150px

  .search-results-header-city
    display: flex
    justify-content: space-between
    width: 100%

  .search-results-header-city__name
    font-size: 20px
    font-weight: bolder
    color: #06038D
    white-space: nowrap
    width: 100px
    overflow-x: hidden
    text-overflow: ellipsis

  .search-results-header-city__arrow
    padding: 0 20px

  @media (min-width: 576px)
    .search-results-header-city__name
      width: auto

  @media (min-width: 768px)
    .search-results-header
      padding: 1.5rem !important
      flex-wrap: nowrap !important

    .search-results-header-city
      justify-content: flex-start !important
</style>
