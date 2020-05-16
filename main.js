var eventBus = new Vue();

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
    <div class="product">
    
      <div class="product-image">
        <img :src="image" />
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>
        <p>Shipping cost: {{ shipping }}</p>
        <p>{{ sale }}</p>
        <p v-if="inStock">In Stock</p>
        <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
        <button class="button" style="background-color:rgb(19, 231, 192)">
          <a v-bind:href="link" target="_blank" style="font-family: Poppins; color: black;">
            More info</a>
            </button>
      
        <h2>Details:</h2>
        <product-details :details="details"></product-details>
        
        <h3>Colours:</h3>
        <div class="color-oval" v-for="(variant, index) in variants" :key="variant.variantId"
          :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
        </div>

        <ul>
          <li v-for="size in sizes">{{ size }}</li>
        </ul>

        <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to
          Cart</button>
        <button @click="removeFromCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Remove</button>
      </div>
      
      <product-tabs :reviews="reviews"></product-tabs>

    </div>
  `,
  data() {
    return {
      product: "Socks",
      brand: "Vue Mastery",
      selectedVariant: 0,
      altText: "A pair of socks",
      link: "https://vuejs.org/",
      details: ["ethical", "80% cotton", "gender-neutral"],
      // variants: List[object, object]
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "assets/vmSocks-green-onWhite.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 0,
        },
      ],
      reviews: [],
      sizes: ["S-Womens", "M-Womens", "L-Womens", "XS-children", "M-children"],
      onSale: true,
    };
  },
  methods: {
    addToCart: function () {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart: function () {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
  },
  computed: {
    title: function () {
      return `${this.brand} ${this.product}`;
    },
    image: function () {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock: function () {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale: function () {
      if (this.onSale) {
        return `${this.brand} ${this.product} is on sale!`;
      }
      return `${this.brand} ${this.product} are not on sale!`;
    },
    shipping: function () {
      if (this.premium) {
        return "Free";
      } else {
        return "$" + 2.99;
      }
    },
    mounted() {
      eventBus.$on("review-submitted", (productReview) => {
        this.reviews.push(productReview);
      });
    },
  },
});

Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `,
});

Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
  
    <p v-if="errors.length">
      <b>Please correct the following error(s): </b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="Your Name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>Would you recommend this product?</p>
    <label>Yes
    <input type="radio" value="Yes" v-model="recommend"/>
    </label>
    <label>No
    <input type="radio" value="No" v-model="recommend"/>
    </label>

    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
        
    <button type="submit">
      Submit  
    </button>    

  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };
        this.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) this.errors.push("Name is required.");
        if (!this.review) this.errors.push("Review is required.");
        if (!this.rating) this.errors.push("Rating is required.");
        if (!this.recommend) this.errors.push("Recommendation is required.");
      }
    },
  },
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
    <div>
      <span class="tab"
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="selectedTab = tab">
            {{ tab }}</span>
            
      <div v-show="selectedTab === 'Reviews'">
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="(review, index) in reviews" :key="index">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>
            
      <product-review v-show="selectedTab === 'Make a Review'"></product-review>

    </div>

  `,
  data() {
    return {
      tabs: ["Review", "Make a Review", "Shipping"],
      selectedTab: "Reviews",
    };
  },
});

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeItem(id) {
      for (var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    },
  },
});
