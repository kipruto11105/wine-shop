<template>
  <div class="checkout grid-x grid-margin-x">
    <div v-if="cartProducts.length > 0" class="card cell small-12 medium-5 large-5">
      <div class="card-section">
        <form>
          <h4 class="text-center">Checkout</h4>
          <label>Full Name
            <input v-model="form.name" type="text" placeholder="John Doe">
          </label>
          <label>Estate
            <input v-model="form.estate" type="text" placeholder="e.g. Kinjunje Flats">
          </label>
          <label>Phone Number
            <input v-model="form.phone" type="number" placeholder="0701234567">
          </label>
          <label>Address
            <input v-model="form.address" type="text" placeholder="Enter street/building">
          </label>
          <label>Delivery Notes
            <textarea cols="12" v-model="form.delivery_notes" type="textarea" placeholder="Delivery Notes"/>
          </label>
        </form>
        <br>
        <div class="grid-x">
          <div class="cell medium-6 large-6 align-left">
            <button @click="$router.go(-1)" class="button--grey"><< Back</button>
          </div>
          <div class="cell medium-6 large-6 align-right">
            <button @click="checkout" class="button--dark">Proceed</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="cartProducts.length > 0" class="card cell small-12 medium-5 large-5">
      <div class="card-section">
        <h4 class="text-center">Items on Cart</h4>
        <div v-for="(product, index) in cartProducts" :key="index">
          <table>
            <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr class="align-center-middle">
              <td>{{index + 1}}.</td>
              <td>{{product.name}}</td>
              <td>
                <p v-if="product.quantity.bottle > 0">
                  {{product.quantity.bottle}} bottle(s) x {{product.price.bottle}}
                </p>
                <p v-if="product.quantity.case > 0">
                  {{product.quantity.case}} case(s) x {{product.price.case}}
                </p>
              </td>
              <td>
                {{
                  (product.price.bottle * product.quantity.bottle)
                  + (product.price.case * product.quantity.case) | currency
                }}
              </td>
              <td class="align-center-middle">
                <button @click="removeItem(index)">X</button>
              </td>
            </tr>
            </tbody>
          </table>
          <br>
          <div class="text-center">
            <strong>
              Grand Total: {{cartTotal | currency}}
            </strong>
          </div>
        </div>
      </div>
    </div>
    <div class="cell small-12 medium-12 large-12">
      <div class="back-to-shopping">
        <p class="text-center">
          You have no items on your cart
        </p>
        <button @click="$router.go(-1)">Back to Shopping</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Swal from 'sweetalert2'
  import {mapGetters} from "vuex";

  export default {
    name: "checkout",
    comments: {Swal},
    data() {
      return {
        form: {}
      }
    },
    computed: {
      ...mapGetters({
        cartProducts: 'cartProducts',
        cartTotal: 'cartTotal',
        totalCartItems: 'totalCartItems'
      })
    },
    methods: {
      removeItem(index) {
        Swal.fire({
          title: 'Are you sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Proceed'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch('removeItem', index)
              .then(() => {
                Swal.fire(
                  'Removed!',
                  'Item has been deleted from cart',
                  'success'
                )
              })
          }
        })
      },
      checkout() {
        this.$store.dispatch('checkout')
          .then(() => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Order placed successfully',
              showConfirmButton: false,
              timer: 1800
            }).then(() => {
              this.$router.go(-1)
            })
          })
      }
    }
  }
</script>

<style scoped lang="scss">
  .checkout {
    margin-top: 40px;

    button {
      cursor: pointer;
    }

    .align-right {
      display: flex;
      justify-content: flex-end;
    }

    .back-to-shopping {
      margin-top: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;

      button {
        width: 180px;
        border: 1px #da990c solid;
        padding: 15px;
        border-radius: 5px;

        &:hover {
          background: #da990c;
          transition: all .4s ease-in-out;
        }
      }
    }
  }
</style>
