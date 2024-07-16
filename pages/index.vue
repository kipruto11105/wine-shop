<template>
  <div>
    <div class="mobile-card">
      <div class="grid-x products">
        <div class="cell products-details">
          <div class="grid-x">
            <div class="cell small-8 cart-total-items">
              <p class="case-items">
                Bottles: <strong>{{totalCartItems.bottleItems || 0}}</strong>
              </p>
              <p class="bottle-items">
                Cases: <strong>{{totalCartItems.caseItems || 0}}</strong>
              </p>
              <p class="bottle-items">
                Total: <strong>{{cartTotal | currency}}</strong>
              </p>
            </div>
            <div class="cell small-4 actions">
              <button class="button--dark" @click="checkout">Checkout</button>
              <button class="button--grey" @click="emptyCart">Empty Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <product-details v-if="showDetails" :details="details"
                     @closeModal="showDetails = false"/>
    <div v-if="!checkingOut" class="container">
      <div class="heading text-center">
        <h3>Wine Shop</h3>
        <p class="domain-name">wineshop.com</p>
      </div>
      <div class="grid-x filter grid-margin-x">
        <div class="cell medium-3 large-3 filter-card">
          <div class="grid-x grid-padding-x filter-card-heading">
            <div class="cell small-6 medium-6 large-6 text-left">Filters</div>
            <div v-if="keywords.length > 0" @click="keywords = []" class="cell small-6 medium-6 large-6 text-right">Clear</div>
          </div>
          <div class="grid-x grid-margin-x filter-card-items">
            <div @click="filterItem(tag)" :key="index" v-for="(tag, index) in productTags"
                 :class="{filter_selected:filterSelected(tag)}"
                 class="cell cursor-pointer small-text-center small-4 medium-4 large-4 filter-card-item">
              {{tag}}
            </div>
          </div>
        </div>
        <div class="cell medium-9 large-9 checkout-card">
          <div class="grid-x grid-margin-x details">
            <div class="cell checkout-card-info medium-3 large-3 grid-x align-center-middle">
              <p>Delivery info</p>
            </div>
            <div class="cell checkout-card-info medium-3 large-3 cart-info-items">
              <p class="case-items text-center">
                Bottles: <strong>{{totalCartItems.bottleItems || 0}}</strong>
              </p>
              <p class="bottle-items text-center">
                Cases: <strong>{{totalCartItems.caseItems || 0}}</strong>
              </p>
            </div>
            <div class="cell checkout-card-info checkout-details medium-6 large-6">
              <div class="grid-x">
                <div class="cell medium-8 large-8">
                  <p>
                    Items in cart: <strong>{{cartProducts.length || 0}}</strong>
                  </p>
                </div>
                <div class="cell medium-4 large-4 align-right">
                  <button :disabled="cartProducts.length < 1" class="button--grey" @click="emptyCart">Empty Cart
                  </button>
                </div>
              </div>
              <br>
              <div class="grid-x">
                <div class="cell medium-8 large-8 padding-3">
                  <p class="padding-3">
                    Total Price <strong>{{cartTotal | currency}}</strong>
                  </p>
                </div>
                <div class="cell medium-4 large-4 align-right">
                  <button class="button--dark" @click="checkout">Checkout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid-x items-container">
        <div class="cell" v-if="fetchingData">
          <placeholder/>
        </div>
        <div v-if="!fetchingData" v-for="(product, index) in products" :key="index"
             class="cell small-12 medium-6 large-4 display-item">
          <div class="grid-x">
            <div class="cell small-3 medium-3 large-3 image">
              <img class="" :src="`/api/wine-bottles/`+product.image" alt="">
            </div>
            <div class="cell small-9 medium-9 large-9 description">
              <h4 class="number">{{product.no}}</h4>
              <h4 class="name">{{product.name}}</h4>
              <br>
              <div class="grid-x details">
                <div class="cell small-5 medium-6 large-3 border-right">
                  <h4>Bottle</h4>
                  <p class="price">{{product.cost.bottle | currency}}</p>
                  <div class="grid-x amount">
                    <div class="cell small-5 medium-5 large-5">
                      <input v-model="quantity.bottle[index]" class="bottle-qty" type="text">
                    </div>
                    <div class="cell small-5 medium-5 large-5">
                      <p class="qty">QTY</p>
                    </div>
                  </div>
                </div>
                <div class="cell small-5 medium-6 large-3 padding-left">
                  <h4>Case</h4>
                  <p class="price">{{product.cost.case | currency}}</p>
                  <div class="grid-x amount">
                    <div class="cell small-5 medium-5 large-5">
                      <input v-model="quantity.case[index]" class="bottle-qty" type="text">
                    </div>
                    <div class="cell small-5 medium-5 large-5">
                      <p class="qty">QTY</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid-x actions">
                <div class="cell small-5 medium-3 large-3 btn">
                  <button class="button--grey" @click="showModal(product)">Details</button>
                </div>
                <div class="cell small-5 medium-3 large-3 btn">
                  <button class="button--dark" @click="addProductToCart(product, index)">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="checkingOut">
      <checkout/>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import Checkout from "~/components/checkout";
  import Swal from 'sweetalert2'
  import Placeholder from "~/components/placeholder";
  import ProductDetails from "~/components/product-details";

  export default {
    components: {ProductDetails, Placeholder, Checkout, Swal},
    data() {
      return {
        quantity: {
          case: [],
          bottle: []
        },
        tags: [],
        keywords: [],
        checkingOut: false,
        showDetails: false,
        details: {}
      }
    },
    computed: {
      ...mapGetters({
        products: 'availableProducts',
        cartProducts: 'cartProducts',
        fetchingData: 'fetchingData',
        productTags: 'productTags',
        cartTotal: 'cartTotal',
        totalCartItems: 'totalCartItems'
      }),
    },
    methods: {
      fetchData() {
        this.$store.dispatch('fetchProducts');
      },
      addProductToCart(product, index) {
        if (this.quantity.bottle.length < 1 && this.quantity.case.length < 1) {
          return;
        }

        let qty = {
          bottle: this.quantity.bottle.length > 0 ? this.quantity.bottle[index] : 0,
          case: this.quantity.case.length > 0 ? this.quantity.case[index] : 0,
        }

        this.$store.dispatch('addProductToCart', {
            quantity: qty,
            product
          }
        )
      },
      filterItem(tag) {
        this.keywords.push(tag);
        this.$store.dispatch('filterProducts', {
          keyword: this.keywords
        })
      },
      emptyCart() {
        Swal.fire({
          title: 'Are you sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Proceed'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch('emptyCart')
              .then(() => {
                Swal.fire(
                  'Empty!',
                  'Your cart is now empty.',
                  'success'
                )
              })
          }
        })
      },
      checkout() {
        this.checkingOut = true;
      },
      showModal(product) {
        this.details = {
          name: product.name,
          description: product.details
        }
        this.showDetails = true
      },
      filterSelected(tag){
        return this.keywords.includes(tag);
      }
    },
    mounted() {
      this.fetchData();
    }
  }
</script>
<style lang="scss" scoped>
  .container {
    padding: 25px 70px;
    @media screen and (max-width: 1023px) {
      padding: 25px 30px;
    }
    .domain-name{
      line-height: .3;
      margin-bottom: 1.2rem;
    }

    .filter {
      .checkout-card {
        @media screen and (max-width: 1023px) {
          display: none;
        }

        .details {
          display: flex;
          justify-content: center;

          .checkout-details {
            padding: 20px;
          }

          .cart-info-items {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column wrap;
            font-size: 25px;
            font-family: "Iowan Old Style", serif;
            font-weight: 600;
            padding-top: 10px;
          }

          .checkout-card-info {
            height: 150px;
            background: rgb(239 239 239 / 62%);
            margin-left: 0.07rem;
            margin-right: 0.07rem;

            .align-right {
              display: flex;
              justify-content: center;
              align-items: center;

              button {
                width: 100px;
                font-size: 12px;
                padding: 8px 0;
              }
            }
          }
        }
      }

      &-card {
        background: rgb(239 239 239 / 62%);
        height: 130px;
        padding: 8px 2px;

        &-heading {
          font-size: 13px;
          color: dimgray;
        }

        &-items {
          margin: auto;

          .small-text-center {
            text-align: center;
            font-size: 13px;
            padding: 4px 0;
          }

          .filter-card-item {
            margin: 10px;
            background: #d2d2d2cf;
          }
          .filter_selected{
            background: #000;
            color: #fff;
          }
        }
      }
    }

    .items-container {
      .display-item {
        padding: 80px 0;
        border-bottom: 1px #000 dotted;

        &:nth-child(n+7) {
          border: none;
        }

        .number {
          font-size: 60px;
          font-family: IowanOldSt, serif;
          font-weight: 600;
          color: #767676;
          line-height: 0.8;
        }

        .name {
          line-height: 0.8;
          font-size: 26px;
          font-family: IowanOldSt, serif;
          color: #767676;
        }

        .image {
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            height: 275px;
          }
        }

        .description {
          padding-left: 8px;

          .details {
            margin-top: 25px;

            .amount {
              margin-top: 5px;

              input {
                width: 25px;
                height: 25px;
                margin: 0;
                border: 1px #000 solid;
                padding: 1px;
              }

              .qty {
                margin-bottom: 0;
                font-size: 15px;
                font-family: IowanOldSt, serif;
              }
            }

            .border-right {
              border-right: 1px dotted #000;
              //padding-right: 23px;
            }

            .padding-left {
              margin-left: 20px;
            }

            h4, .price {
              font-size: 15px;
              line-height: 1;
              margin-bottom: -2px;
              font-family: IowanOldSt, serif;
              mso-font-width: 1px;
            }

            .price {
              margin-top: 7px;
            }
          }

          .actions {
            margin-top: 25px;

            .btn {
              margin: 0 2px 0 0;
            }
          }
        }
      }
    }
  }

  .mobile-card {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #e6e6e6;
    position: fixed;
    bottom: 0;
    width: 100%;

    @media screen and (min-width: 1024px) {
      display: none;
    }

    .products {
      p {
        float: left;
        width: 100%;
        margin-bottom: 0;
      }

      .products-details {
        display: block;
        padding: 14px 16px;

        .actions {
          position: absolute;
          right: 0;

          button {
            width: 100px;
          }
        }
      }
    }
  }


  .products a:hover:not(.active) {
    background-color: #111;
  }

  .active {
    background-color: #04AA6D;
  }
</style>
