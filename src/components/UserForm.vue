<template>
  <div class="mt-5">
    <b-alert variant="warning" show v-if="showWarning">Please, check all fields before submit!</b-alert>
    <b-alert variant="success" show v-if="showSuccess">Form submitted with success!</b-alert>
    <b-alert variant="danger" show v-if="showError">Something went wrong while trying to sabe the user! Try again!</b-alert>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-1" label="Your Name:" label-for="name">
        <b-form-input id="name" v-model="$v.form.name.$model" :state="validateState('name')" placeholder="Enter your name" aria-describedby="name-feedback"></b-form-input>
        <b-form-invalid-feedback id="name-feedback">This is a required field and must be at least 3 characters.</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Email Address:" label-for="email" description="We'll never share your email with anyone else.">
        <b-form-input
          id="email"
          v-model="$v.form.email.$model"
          :state="validateState('email')"
          type="email"
          placeholder="Enter your email"
          aria-describedby="email-feedback"
        ></b-form-input>
        <b-form-invalid-feedback id="email-feedback">This is not a valid email</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-3" label="Your Phone Number:" label-for="phone" description="We'll never share your phone with anyone else.">
        <b-form-input
          id="phone"
          v-mask="'(XXX) XXX-XXXX'"
          v-model="$v.form.phone.$model"
          :state="validateState('phone')"
          placeholder="Enter your phone"
          aria-describedby="phone-feedback"
        ></b-form-input>
        <b-form-invalid-feedback id="phone-feedback">This is not a valid phone</b-form-invalid-feedback>
      </b-form-group>

      <div class="row">
        <div class="col-9">
          <b-form-group id="input-group-4" label="Your Address:" label-for="address">
            <b-form-input
              id="address"
              v-model="$v.form.address.$model"
              :state="validateState('address')"
              placeholder="Enter your address"
              aria-describedby="address-feedback"
            ></b-form-input>
            <b-form-invalid-feedback id="address-feedback">This is a required field and must be at least 9 characters.</b-form-invalid-feedback>
          </b-form-group>
        </div>

        <div class="col-3">
          <b-form-group id="input-group-5" label="ZIP Code:" label-for="zip">
            <b-form-input id="zip" v-model="$v.form.zip.$model" :state="validateState('zip')" placeholder="ZIP Code" aria-describedby="zip-feedback"></b-form-input>
            <b-form-invalid-feedback id="zip-feedback">This is not a valid zip</b-form-invalid-feedback>
          </b-form-group>
        </div>
      </div>

      <b-form-group
        id="input-group-6"
        label="Your Document Files (Personal Foto and License Image):"
        label-for="images"
        description="We'll never share your documents with anyone else."
      >
        <b-form-file
          id="images"
          v-model="$v.form.images.$model"
          :state="validateState('images')"
          placeholder="Choose files or drop them here..."
          drop-placeholder="Drop files here..."
          aria-describedby="images-feedback"
          accept="image/*"
          multiple
        ></b-form-file>
        <b-form-invalid-feedback id="images-feedback">This is a required field and must be at least 2 images.</b-form-invalid-feedback>
        <div class="mt-3" v-if="form.images.length">Selected files: {{ form.images.length ? form.images.map((image) => image.name).join(", ") : "" }}</div>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import { required, minLength, maxLength, email, numeric, helpers } from "vuelidate/lib/validators";

const mustHaveAtLeastTwoImages = (value) => value.length >= 2;
const mustMatchPhonePattern = (value) => helpers.regex(value, /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/);

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        phone: "",
        address: "",
        zip: "",
        images: [],
      },
      showWarning: false,
      showSuccess: false,
      showError: false,
    };
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3),
      },
      email: {
        required,
        email,
      },
      phone: {
        required,
        mustMatchPhonePattern,
        minLength: minLength(14),
        maxLength: maxLength(14),
      },
      address: {
        required,
        minLength: minLength(9),
      },
      zip: {
        required,
        numeric,
        minLength: minLength(5),
        maxLength: maxLength(5),
      },
      images: {
        required,
        mustHaveAtLeastTwoImages,
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    onSubmit(event) {
      event.preventDefault();

      this.$v.$touch();

      if (this.$v.$invalid) {
        this.showWarning = true;
      } else {
        this.showWarning = false;
        this.showSuccess = false;
        this.showError = false;

        var formData = new FormData();

        formData.append("name", this.form.name);
        formData.append("email", this.form.email);
        formData.append("phone", this.form.phone);
        formData.append("address", this.form.address);
        formData.append("zip", this.form.zip);
        this.form.images.forEach((image) => {
          formData.append("images[]", image, image.name);
        });

        axios({
          method: "post",
          url: "http://localhost:8000/api/users",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((response) => {
            if (response.status === 201) {
              this.showSuccess = true;

              // Reset our form values
              this.form.name = "";
              this.form.email = "";
              this.form.phone = "";
              this.form.address = "";
              this.form.zip = "";
              this.form.images = [];

              this.$v.$reset();
            }
          })
          .catch((error) => {
            this.showError = true;
          });
      }
    },
    onReset(event) {
      event.preventDefault();

      // Reset our form values
      this.form.name = "";
      this.form.email = "";
      this.form.phone = "";
      this.form.address = "";
      this.form.zip = "";
      this.form.images = [];

      this.$nextTick(() => {
        this.showWarning = false;
        this.showSuccess = false;
        this.showError = false;
      });
    },
  },
};
</script>

<style></style>
