<template>
  <div id="app" class="container">
    <tab />
    <user-form />
  </div>
</template>

<script>
import Tab from "./components/Tab";
import UserForm from "./components/UserForm";

export default {
  name: "app",
  components: {
    Tab,
    UserForm,
  },
};
</script>

<style></style>
