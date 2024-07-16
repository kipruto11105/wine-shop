const {v4: uuidv4} = require('uuid');

export const state = () => ({
  items: [],
  cart: [],
  tags: [],
  filteredProducts: [],
  checkoutStatus: null,
  fetchingData: false
})

export const getters = {
  fetchingData: state => state.fetchingData,
  productTags: state => state.tags,
  cartProducts(state, getters) {
    if (state.cart.length) {
      return state.cart.map(cartItem => {
        const product = state.items.find(product => product.id === cartItem.id)
        return {
          details: product.hasOwnProperty('details') ? product.details : '',
          price: {
            case: product.cost.case,
            bottle: product.cost.bottle,
          },
          quantity: cartItem.quantity,
          name: product.name,
          id: product.id
        }
      })
    }
    return [];
  },

  cartTotal(state, getters) {
    let bottleItems = getters.cartProducts.reduce((total, product) => total + product.price.bottle * product.quantity.bottle, 0);
    let caseItems = getters.cartProducts.reduce((total, product) => total + product.price.case * product.quantity.case, 0)
    return bottleItems + caseItems;
  },

  totalCartItems(state, getters) {
    let bottleItems = getters.cartProducts.reduce((total, product) => total + product.quantity.bottle, 0);
    let caseItems = getters.cartProducts.reduce((total, product) => total + product.quantity.case, 0)
    return {
      bottleItems,
      caseItems
    };
  },

  availableProducts(state, getters) {
    return state.filteredProducts.length > 0
      ? state.filteredProducts
      : state.items.filter(product => {
        return product.quantity.case > 0 || product.quantity.bottle > 0
      })
  },

  productIsInStock() {
    return (product) => {
      return product.quantity.case > 0 || product.quantity.bottle > 0
    }
  },

}

export const mutations = {
  pushProductToCart(state, payload) {
    state.cart.push({
      id: payload.product.id,
      quantity: {
        case: payload.quantity.hasOwnProperty('case') ? parseInt(payload.quantity.case) : null,
        bottle: payload.quantity.hasOwnProperty('bottle') ? parseInt(payload.quantity.bottle) : null,
      }
    })
  },

  incrementItemQuantity(state, payload) {
    let quantity = payload.items.quantity;
    let cartItem = payload.cartItem;

    if (quantity.case) {
      cartItem.quantity.case += parseInt(quantity.case)
    }
    if (quantity.bottle) {
      cartItem.quantity.bottle += parseInt(quantity.bottle)
    }
  },

  setCheckoutStatus(state, status) {
    state.checkoutStatus = status
  },

  emptyCart(state) {
    state.cart = []
  },

  setProducts(state, products) {
    state.items = products
  },

  decrementProductInventory(state, payload) {
    if (payload.quantity.case) {
      payload.product.quantity.case -= parseInt(payload.quantity.case)
    }
    if (payload.quantity.bottle) {
      payload.product.quantity.bottle -= parseInt(payload.quantity.bottle)
    }
  },
  setFilteredProducts(state, payload) {
    state.filteredProducts = state.items.filter((product) => {
      return payload.keyword.some(keyword => product.tags.some(tag => tag === keyword));
    })
  },
  setProductTags(state, tags) {
    let newArray = []
    tags.map(tag => tag.map(t => newArray.push(t)))
    state.tags = [...new Set(newArray)]
  },
  fetchingStatus(state, status) {
    state.fetchingData = status;
  },
  removeItemFromCart(state, product) {
    const index = state.cart.map(function (item) {
      return item.id;
    }).indexOf(product);

    state.cart.splice(index, 1);
  }
}

export const actions = {
  addProductToCart({state, getters, commit}, payload) {
    if (getters['productIsInStock'](payload.product)) {
      const cartItem = state.cart.find(item => item.id === payload.product.id)
      if (!cartItem) {
        commit('pushProductToCart', payload)
      } else {
        commit('incrementItemQuantity', {
          cartItem,
          items: payload
        })
      }
      commit('decrementProductInventory', payload)
    }
  },

  checkout({state, commit}) {
    commit('emptyCart')
    commit('setCheckoutStatus', 'success')
  },

  fetchProducts({commit}) {
    commit('fetchingStatus', true)
    setTimeout(() => {
      this.$axios.get('/api/wine-shop.json', {progress: true})
        .then((response) => {
          commit('fetchingStatus', false)
          let items = response.data;
          let tags = [];
          items.forEach(item => {
            item.id = uuidv4();
            item.quantity = {
              case: Math.floor(Math.random() * 100) + 1,
              bottle: Math.floor(Math.random() * 100) + 1,
            };
            tags.push(item.tags);
          })
          commit('setProducts', items)
          commit('setProductTags', tags)
        })
        .catch(() => {
          commit('fetchingStatus', false)
        })
    }, 5000)
  },
  filterProducts({commit}, payload) {
    commit('setFilteredProducts', payload)
  },
  async emptyCart({commit}) {
    await commit('emptyCart')
  },
  removeItem({commit}, product) {
    commit('removeItemFromCart', product);
  }
}
