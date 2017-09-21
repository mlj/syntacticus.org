<template>
  <div class="section">
    <vue-good-wizard 
      :steps="steps"
      :onNext="nextClicked" 
      :onBack="backClicked">
      <div slot="page1">
        <h4>Step 1: Error type</h4>
        <p>Error type</p>
      </div>
      <div slot="page2">
        <h4>Step 2: Error details</h4>
        <p>Error details</p>
      </div>
      <div slot="page3">
        <h4>Step 3: Review</h4>
        <p>Review</p>
      </div>
      <div slot="page4">
        <h4>Step 4: Submit</h4>
        <p>Submit</p>
      </div>
    </vue-good-wizard>
  </div>
</template>

<script>
export default {
  data() {
    return {
      steps: [
        {
          label: 'Error type',
          slot: 'page1',
        },
        {
          label: 'Error details',
          slot: 'page2',
        },
        {
          label: 'Review',
          slot: 'page3',
        },
        {
          label: 'Submit',
          slot: 'page4',
        }
      ],
    };
  },

  methods: {
    nextClicked(currentPage) {
      //const _this = this;
      //
      // if we're on the form page
      //if (currentPage == 1) {
      //
      //  // on next, we need to validate the form
      //  _this.$refs.myForm.validate((valid) => {
      //    if (valid) {
      //
      //      //all is good, lets proceed to next step
      //      _this.$refs.wizard.goNext(true);
      //    } else {
      //
      //      //error. don't proceed.
      //      console.log('error submit!!');
      //      return false;
      //    }
      //  });
      //  return false; //don't proceed by default. 
      //}
      //return true; //return false if you want to prevent moving to next page

      console.log('next clicked', currentPage)
      return true; //return false if you want to prevent moving to next page
    },

    backClicked(currentPage) {
      console.log('back clicked', currentPage);
      return true; //return false if you want to prevent moving to previous page
    }
  },
};
</script>
