<template>
  <div id="app">
      <router-link to="/">Go To Home</router-link>
      <router-link to="/about">Go To About</router-link>
      <router-link to="/item/1">Go To Item 1</router-link>
      <router-link to="/login">Login Page</router-link>
      <router-link to="/airports">Airports</router-link>
    <router-view></router-view>
    Hello world!
  </div>
</template>
<script>
  export default {
  };
</script>
