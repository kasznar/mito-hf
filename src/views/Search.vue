<template>
  <div class="search">
    <div class="header">
      <router-link to="/">
        <img class="header__icon" alt="Mito logo" src="../assets/mito_logo.svg" >
      </router-link>
      <template>
        <div class="header-city">
          <div class="header-city__title">LEAVING FROM</div>
          <div class="header-city__city">
              {{ cityNames.departureStationName }}
          </div>
        </div>
        <img alt="Right arrow" class="header__arrows" src="../assets/two-way-arrows.svg">
        <div class="header-city">
          <div class="header-city__title">&nbsp;</div>
          <div class="header-city__city">
            {{ cityNames.arrivalStationName }}
          </div>
        </div>
      </template>
    </div>

    <div class="results-header">
      <div class="results-header__spacer">&nbsp;</div>
      <img class="results-header__icon" src="../assets/airplane.svg" alt="Airplane">
      <span class="results-header__title">SELECT FLIGHT</span>
    </div>

    <div class="content">
      <div class="content__cart">
        <div class="cart-header">
          <div class="cart-header__title">FLIGHTS</div>
          <div class="cart-header__price">${{sumPrice}}</div>
        </div>
        <template v-if="!outboundTicket">
          <div class="empty-cart">
            Choose an outbound flight
          </div>
        </template>
        <template v-if="outboundTicket">
          <div class="cart-item">
            <div class="cart-item__date">
              <div class="calendar-icon">
                <div class="calendar-icon__month">
                  {{ outboundTicket.selectedFlight.departure | formatCartMonth }}
                </div>
                <div class="calendar-icon__day">
                  {{ outboundTicket.selectedFlight.departure | formatCartDay }}
                </div>
              </div>
            </div>
            <div class="cart-item-info">
              <div class="cart-item-info__cities">
                {{ outboundTicket.airports.fromName }}-
                <br>
                {{ outboundTicket.airports.toName }}
              </div>
              <div class="cart-item-info__time">
                {{ outboundTicket.selectedFlight | formatCartTime }}
              </div>
            </div>
          </div>
        </template>
        <template v-if="inboundTicket">
          <div class="cart-item cart-item--dotted-border">
            <div class="cart-item__date">
              <div class="calendar-icon">
                <div class="calendar-icon__month">
                  {{ inboundTicket.selectedFlight.departure | formatCartMonth }}
                </div>
                <div class="calendar-icon__day">
                  {{ inboundTicket.selectedFlight.departure | formatCartDay }}
                </div>
              </div>
            </div>
            <div class="cart-item-info">
              <div class="cart-item-info__cities">
                {{ inboundTicket.airports.fromName }}-
                <br>
                {{ inboundTicket.airports.toName }}
              </div>
              <div class="cart-item-info__time">
                {{ inboundTicket.selectedFlight | formatCartTime }}
              </div>
            </div>
          </div>
        </template>
        <div class="cart-total">
          <span>TOTAL</span>
          <span>${{sumPrice}}</span>
        </div>

        <button
          class="cart-pay-btn"
          v-on:click="showModal=true"
          :disabled="!outboundTicket && !inboundTicket">
          PAY NOW
        </button>
      </div>
      <div class="content__results">
        <search-results-block
          v-bind:title="'OUTBOUND'"
          v-bind:from-name="cityNames.arrivalStationName"
          v-bind:to-name="cityNames.departureStationName">
          <template v-if="outboundSearch">
            <SearchResults
              class="search-results"
              v-bind:searchParameters="outboundSearch"
              v-bind:dateBoundaries="departureDateBoundaries"
              v-on:dateChanged="onOutboundDateChange"
              v-on:ticketClicked="outboundClicked"
            />
          </template>
        </search-results-block>

        <search-results-block
          v-bind:title="'INBOUND'"
          v-bind:from-name="cityNames.arrivalStationName"
          v-bind:to-name="cityNames.departureStationName">
          <template v-if="inboundSearch">
            <SearchResults
              class="search-results"
              v-bind:searchParameters="inboundSearch"
              v-bind:dateBoundaries="returnDateBoundaries"
              v-on:dateChanged="onInboundDateChange"
              v-on:ticketClicked="inboundClicked"
            />
          </template>
          <div v-else class="return-datepicker">
            <datepicker
              class="return-datepicker__input"
              v-model="returnDate"
              placeholder="Return"
              :disabled-dates="disableReturnDate">
            </datepicker>
            <button class="return-datepicker__btn" v-on:click="searchReturn">SEARCH</button>
          </div>
        </search-results-block>
      </div>
    </div>

    <div class="modal" v-if="showModal">
      <div class="modal-overlay" v-on:click="showModal=false"></div>
      <div class="modal__wrapper">
        <div class="modal-content">
          <div class="modal-content__header">
            <span>Thanks for buying your tickets at mito airlin</span>
          </div>
          <div class="modal-content__items">
            <template v-if="outboundTicket">
              <div class="cart-item">
                <div class="cart-item__date">
                  <div class="calendar-icon">
                    <div class="calendar-icon__month">
                      {{ outboundTicket.selectedFlight.departure | formatCartMonth }}
                    </div>
                    <div class="calendar-icon__day">
                      {{ outboundTicket.selectedFlight.departure | formatCartDay }}
                    </div>
                  </div>
                </div>
                <div class="cart-item-info">
                  <div class="cart-item-info__cities">
                    {{ outboundTicket.airports.fromName }}-
                    <br>
                    {{ outboundTicket.airports.toName }}
                  </div>
                  <div class="cart-item-info__time">
                    {{ outboundTicket.selectedFlight | formatCartTime }}
                  </div>
                </div>
              </div>
            </template>
            <template v-if="inboundTicket">
              <div class="cart-item cart-item--inbound">
                <div class="cart-item__date">
                  <div class="calendar-icon">
                    <div class="calendar-icon__month">
                      {{ inboundTicket.selectedFlight.departure | formatCartMonth }}
                    </div>
                    <div class="calendar-icon__day">
                      {{ inboundTicket.selectedFlight.departure | formatCartDay }}
                    </div>
                  </div>
                </div>
                <div class="cart-item-info">
                  <div class="cart-item-info__cities">
                    {{ inboundTicket.airports.fromName }}-
                    <br>
                    {{ inboundTicket.airports.toName }}
                  </div>
                  <div class="cart-item-info__time">
                    {{ inboundTicket.selectedFlight | formatCartTime }}
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="modal-content__footer">
            <div class="modal-total">
              <span class="modal-total__text">TOTAL: </span>
              <span class="modal-total__value">${{sumPrice}}</span>
            </div>
            <div class="modal-reset" v-on:click="resetCart">
              No, thanks (reset)
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchResults from '@/components/SearchResults.vue'
import Datepicker from 'vuejs-datepicker'
import SearchResultsBlock from '../components/SearchResultsBlock'
import { dateFormatter } from '../util/formatter'
import moment from 'moment'
import { EventBus } from '../eventbus'

const PARAM_REURN_DATE = '&returnDate='

export default {
  name: 'search',
  components: {
    SearchResults,
    Datepicker,
    SearchResultsBlock
  },
  data () {
    return {
      outboundSearch: null,
      inboundSearch: null,
      returnDate: null,
      outboundTicket: null,
      inboundTicket: null,
      showModal: false
    }
  },
  methods: {
    searchReturn: function () {
      const routeQuery = this.$route.query
      this.inboundSearch = {
        from: routeQuery.arrivalStation,
        fromName: routeQuery.arrivalStationName,
        to: routeQuery.departureStation,
        toName: routeQuery.departureStationName,
        date: this.formattedReturnDate
      }
      // hozzáadja a visszaút dátumát az url paraméterekhez
      this.$router.replace(this.$route.fullPath + PARAM_REURN_DATE + this.formattedReturnDate)
    },
    updateRouteDates: function (dates) {
      let routeParams = {
        departureStation: this.$route.query.departureStation,
        departureStationName: this.$route.query.departureStationName,
        arrivalStation: this.$route.query.arrivalStation,
        arrivalStationName: this.$route.query.arrivalStationName,
        departureDate: dates.departureDate || this.$route.query.departureDate
      }

      if (this.$route.query.returnDate || dates.returnDate) {
        routeParams.returnDate = dates.returnDate || this.$route.query.returnDate
      }

      this.$router.push({
        path: 'search',
        query: routeParams
      })
    },
    onOutboundDateChange: function (value) {
      this.updateRouteDates({
        departureDate: value
      })
    },
    onInboundDateChange: function (value) {
      this.updateRouteDates({
        returnDate: value
      })
    },
    outboundClicked: function (value) {
      this.outboundTicket = value
    },
    inboundClicked: function (value) {
      this.inboundTicket = value
    },
    resetCart: function () {
      this.showModal = false
      this.outboundTicket = null
      this.inboundTicket = null
      EventBus.$emit('reset-cart')
    }
  },
  computed: {
    formattedReturnDate: function () {
      return dateFormatter(this.returnDate)
    },
    cityNames: function () {
      return {
        departureStationName: this.$route.query.departureStationName,
        arrivalStationName: this.$route.query.arrivalStationName,
        departureDate: this.$route.query.departureDate
      }
    },
    departureDateBoundaries: function () {
      const dateObj = new Date()
      return {
        minDate: dateFormatter(dateObj),
        maxDate: this.$route.query.returnDate
      }
    },
    returnDateBoundaries: function () {
      return {
        minDate: this.$route.query.departureDate,
        maxDate: null
      }
    },
    disableReturnDate: function () {
      return {
        to: new Date(this.$route.query.departureDate)
      }
    },
    sumPrice: function () {
      let res = 0
      if (this.outboundTicket) {
        res += this.outboundTicket.selectedFare.price
      }
      if (this.inboundTicket) {
        res += this.inboundTicket.selectedFare.price
      }
      return res
    }
  },
  mounted () {
    const routeQuery = this.$route.query
    this.outboundSearch = {
      from: routeQuery.departureStation,
      fromName: routeQuery.departureStationName,
      to: routeQuery.arrivalStation,
      toName: routeQuery.arrivalStationName,
      date: routeQuery.departureDate
    }

    // ha van megadva vissza út dátum, akkor a cél és induló állomást megcserélve végez el egy keresést
    if (routeQuery.returnDate) {
      this.inboundSearch = {
        from: routeQuery.arrivalStation,
        fromName: routeQuery.arrivalStationName,
        to: routeQuery.departureStation,
        toName: routeQuery.departureStationName,
        date: routeQuery.returnDate
      }
    }
  },
  filters: {
    formatCartTime: function (selectedFlight) {
      let departureTime = moment(selectedFlight.departure).format('ddd hh:mm')
      let arrivalTime = moment(selectedFlight.arrival).format('hh:mm')
      return departureTime + ' - ' + arrivalTime
    },
    formatCartMonth: function (date) {
      return moment(date).format('MMM')
    },
    formatCartDay: function (date) {
      return moment(date).format('D')
    }
  }
}
</script>

<style src="../../node_modules/vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="sass" scoped>
  .header
    width: 100%
    background-color: #06038D
    padding: 0.5rem 0.8rem
    display: flex
    align-items: center
    color: white
    justify-content: space-between

  .header__icon
    padding-right: 0.8rem

  .header__arrows
    margin: 0 5px

  .header-city__title
    font-size: 10px
    white-space: nowrap

  .header-city__city
    font-size: 20px
    white-space: nowrap
    width: 100px
    overflow-x: hidden
    text-overflow: ellipsis

  .content
    display: flex
    flex-wrap: wrap
    padding-bottom: 300px

  .content__cart
    width: 100%
    order: 99

  .content__results
    width: 100%

  .results-header__title
    font-size: 30px
    color: #0A008B

  .results-header__spacer
    display: none

  .results-header
    display: flex
    padding: 1rem 0
    justify-content: center

  .search-results
    margin-bottom: 4rem

  .return-datepicker
    width: 100%
    padding: 3rem 0.5rem 5rem
    display: flex
    justify-content: center

  .return-datepicker__input
    width: 300px

  .return-datepicker__btn
    margin-left: 0.5rem
    background-color: #3434E0
    font-size: 18px
    text-transform: uppercase
    color: white
    font-weight: bold
    padding: 0 1rem
    border-radius: 3px

  .content__cart
    padding: 0 1rem
    display: flex
    flex-direction: column

  .cart-header
    display: flex
    padding: 1rem
    background-color: white
    justify-content: space-between
    font-size: 14px
    font-weight: bold

  .cart-header__price
    color: #06038D

  .cart-header__title
    color: #343434

  .cart-item
    display: flex
    background-color: white
    padding: 1rem

  .cart-item--dotted-border
    border-top: 1px dashed #C1C1C1

  .calendar-icon
    border: 2px solid #E1E1E1
    border-radius: 3px
    height: 100%

  .calendar-icon__month
    text-align: center
    padding: 3px 5px
    background-color: #F2F2F2
    font-size: 15px
    text-transform: uppercase
    font-weight: bold

  .calendar-icon__day
    text-align: center
    font-weight: bold
    font-size: 20px

  .cart-item-info
    padding-left: 0.5rem

  .cart-item-info__cities
    font-size: 15px
    font-weight: bold
    color: #343434

  .empty-cart
    color: #919191
    font-size: 16px
    font-weight: bold
    padding: 2rem 1rem
    background-color: white

  .cart-total
    display: flex
    justify-content: space-between
    padding: 1rem
    background-color: #06038D
    font-weight: bold
    color: white

  .modal
    position: fixed
    width: 100vw
    height: 100vh
    left: 0
    top: 0
    display: flex
    justify-content: center

  .modal-overlay
    position: fixed
    width: 100vw
    height: 100vh
    left: 0
    top: 0
    background-color: black
    opacity: 0.8

  .modal__wrapper
    width: 600px

  .modal-content
    margin-top: 5rem
    width: 100%
    background-color: white
    border-radius: 3px
    position: relative
    z-index: 10

  .modal-content__header
    text-align: center
    padding: 1.5rem 1rem
    background-color: #F2F2F2
    color: #06038D
    text-transform: uppercase
    font-size: 16px
    border-radius: 3px

  .modal-content__items
    display: flex
    flex-wrap: wrap
    justify-content: space-between
    padding: 1rem

  .modal-content__footer
    display: flex
    justify-content: space-between
    align-items: center
    padding: 2rem
    font-size: 20px

  .modal-total__text
    color: #343434

  .modal-total__value
    color: #06038D

  .modal-reset
    text-transform: uppercase
    text-decoration: underline
    font-size: 12px
    color: #C6007E
    cursor: pointer

  .cart-pay-btn
    width: 100%
    outline: none
    color: white
    font-size: 16px
    text-align: center
    border-radius: 3px
    background-color: #C6007E
    border: none
    font-weight: bold
    margin-top: 1rem
    padding: 1rem 0.5rem
    cursor: pointer

  @media (min-width: 576px)
    .header
      justify-content: left

    .header-city__city
      width: auto !important

  @media (min-width: 768px)
    .header__icon
      margin-right: 200px

    .header__arrows
      margin: 0 40px

    .header
      padding: 1rem 1.2rem

    .results-header__spacer
      display: block !important
      width: 20%

    .results-header
      display: flex
      padding: 2.5rem 0 !important
      justify-content: left

    .results-header__title
      font-size: 40px !important

  @media (min-width: 1200px)
    .content__results
      width: 80% !important
      padding-right: 2rem

    .content__cart
      width: 20% !important
      order: unset !important
</style>
