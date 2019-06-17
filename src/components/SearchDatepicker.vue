<template>
  <div class="search__datepicker">
    <datepicker
      format="yyyy MMM dd"
      :value="value"
      @selected="$emit('value', $event.target.value)"
      placeholder="Departure"
      :disabledDates="disableDate">
    </datepicker>
    <div class="form-warning" v-if="hasError">
      <img class="form-warning__icon" alt="Warning icon" src="../assets/warn.svg">
      <span class="form-warning__text">Please select departure</span>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'SearchDatepicker',
  props: [ 'value', 'hasError', 'disableDate' ],
  data () {
    return {

    }
  },
  components: {
    Datepicker
  }
}
</script>

<style lang="sass" scoped>

</style>
