<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <span @click="$emit('closeModal')" class="close">&times;</span>
        <h3>{{details.name}}</h3>
      </div>
      <div class="modal-body">
        <div>
          {{details.description}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "product-details",
    props: ['details']
  }
</script>

<style scoped lang="scss">
  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
  }

  .modal-content {
    position: relative;
    background-color: #fefefe;
    margin: auto;
    padding: 0;
    top: 25%;
    border: 1px solid #888;
    width: 40%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    -webkit-animation-name: animatetop;
    -webkit-animation-duration: 0.4s;
    animation-name: animatetop;
    animation-duration: 0.4s
  }

  @-webkit-keyframes animatetop {
    from {
      top: -300px;
      opacity: 0
    }
    to {
      top: 0;
      opacity: 1
    }
  }

  @keyframes animatetop {
    from {
      top: -300px;
      opacity: 0
    }
    to {
      top: 0;
      opacity: 1
    }
  }

  .close {
    color: white;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }

  .modal-header {
    padding: 6px;
    background-color: #8a8a8a;
    color: white;
  }

  .modal-body {
    padding: 16px;
  }
</style>
