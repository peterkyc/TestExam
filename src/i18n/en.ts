import { TranslationMessages } from 'react-admin';
import englishMessages from 'ra-language-english';

const customEnglishMessages: TranslationMessages = {
  ...englishMessages,
  login: {
    userId: "Email Adress",
    password: "Password",
    newPassword: "New password",
    repassword: "Re-enter new password",
    name: "Full Name",
    nameHint: "please enter your full name",
    userIdHint: "",
    hintLogin: "fill email and password to login",
    hintRegister: "fill email and password to register",
    hintResetPassword: "fill password and repassword to changed",
    hintResendMail: "please check your email to verify account or click resend button to resend verification mail again",
    hintUserProfile: "UserProfile",
    invalidMail: "invalid email format",
    invalidPassword: "at least one lower, upper, special character and more 8 characters",
    invalidRePassword: "not equals to password ",
    resendMail: "Resend Email Verification",
    resetPassword: "Reset Password",
    resetPasswordOK: "reset password OK",
    resentMailOK: "resent mail OK, please check your email to verify account",
    userProfileOK: "update user profile OK",
    nameNoChanged: "Name is not changed",
    userProfile: "update user profile",
  },
  pos: {
    search: 'Search',
    configuration: 'Configuration',
    userProfile: 'User Profile',
    language: 'Language',
    theme: {
      name: 'Theme',
      light: 'Light',
      dark: 'Dark',
    },
    dashboard: {
      //******** Peter Add
      signedUp: "Number of users signed up",
      session: "Active sessions today",
      average: "Average active in last 7 days",
      //******** Peter Add
      monthly_revenue: 'Monthly Revenue',
      month_history: '30 Day Revenue History',
      new_orders: 'New Orders',
      pending_reviews: 'Pending Reviews',
      all_reviews: 'See all reviews',
      new_customers: 'New Customers',
      all_customers: 'See all customers',
      pending_orders: 'Pending Orders',
      order: {
        items:
          'by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items',
      },
      welcome: {
        title: `Welcome to Peter's test site`,
        subtitle:
          "Welcome to Peter's test site. Feel free to test and review the data.",
        cv: `Peter's CV`,
        demo: `Peter's Demo`,
        swagger: `Swagger Docs`,
        cvUrl: `http://220.132.71.252:8888/PeterCV/index.html`,
        demoUrl: `http://220.132.71.252:8888/antdp`,
        swaggerUrl: `/swagger`,
        ra_button: 'react-admin site',
        demo_button: 'Source for this demo',
      },
    },
    menu: {
      sales: 'Sales',
      catalog: 'Catalog',
      customers: 'Customers',
    },
  },
  resources: {
    resendMail: {
      name: "Resend eMail"
    },
    resetPassword: {
      name: "Reset Password"
    },
    userProfile: {
      name: "User Profile"
    },
    customers: {
      name: 'Customer |||| Customers',
      fields: {
        commands: 'Orders',
        first_seen: 'First seen',
        groups: 'Segments',
        last_seen: 'Last seen',
        last_seen_gte: 'Visited Since',
        name: 'Name',
        total_spent: 'Total spent',
        password: 'Password',
        confirm_password: 'Confirm password',
        stateAbbr: 'State',
      },
      filters: {
        last_visited: 'Last visited',
        today: 'Today',
        this_week: 'This week',
        last_week: 'Last week',
        this_month: 'This month',
        last_month: 'Last month',
        earlier: 'Earlier',
        has_ordered: 'Has ordered',
        has_newsletter: 'Has newsletter',
        group: 'Segment',
      },
      fieldGroups: {
        identity: 'Identity',
        address: 'Address',
        stats: 'Stats',
        history: 'History',
        password: 'Password',
        change_password: 'Change Password',
      },
      page: {
        delete: 'Delete Customer',
      },
      errors: {
        password_mismatch:
          'The password confirmation is not the same as the password.',
      },
    },
    commands: {
      name: 'Order |||| Orders',
      amount: '1 order |||| %{smart_count} orders',
      title: 'Order %{reference}',
      fields: {
        basket: {
          delivery: 'Delivery',
          reference: 'Reference',
          quantity: 'Quantity',
          sum: 'Sum',
          tax_rate: 'Tax Rate',
          taxes: 'Tax',
          total: 'Total',
          unit_price: 'Unit Price',
        },
        address: 'Address',
        customer_id: 'Customer',
        date_gte: 'Passed Since',
        date_lte: 'Passed Before',
        nb_items: 'Nb Items',
        total_gte: 'Min amount',
        status: 'Status',
        returned: 'Returned',
      },
      section: {
        order: 'Order',
        customer: 'Customer',
        shipping_address: 'Shipping Address',
        items: 'Items',
        total: 'Totals',
      },
    },
    invoices: {
      name: 'Invoice |||| Invoices',
      fields: {
        date: 'Invoice date',
        customer_id: 'Customer',
        command_id: 'Order',
        date_gte: 'Passed Since',
        date_lte: 'Passed Before',
        total_gte: 'Min amount',
        address: 'Address',
      },
    },
    products: {
      name: 'Poster |||| Posters',
      fields: {
        category_id: 'Category',
        height_gte: 'Min height',
        height_lte: 'Max height',
        height: 'Height',
        image: 'Image',
        price: 'Price',
        reference: 'Reference',
        sales: 'Sales',
        stock_lte: 'Low Stock',
        stock: 'Stock',
        thumbnail: 'Thumbnail',
        width_gte: 'Min width',
        width_lte: 'Max width',
        width: 'Width',
      },
      tabs: {
        image: 'Image',
        details: 'Details',
        description: 'Description',
        reviews: 'Reviews',
      },
      filters: {
        categories: 'Categories',
        stock: 'Stock',
        no_stock: 'Out of stock',
        low_stock: '1 - 9 items',
        average_stock: '10 - 49 items',
        enough_stock: '50 items & more',
        sales: 'Sales',
        best_sellers: 'Best sellers',
        average_sellers: 'Average',
        low_sellers: 'Low',
        never_sold: 'Never sold',
      },
    },
    categories: {
      name: 'Category |||| Categories',
      fields: {
        products: 'Products',
      },
    },
    reviews: {
      name: 'Review |||| Reviews',
      amount: '1 review |||| %{smart_count} reviews',
      relative_to_poster: 'Review on poster',
      detail: 'Review detail',
      fields: {
        customer_id: 'Customer',
        command_id: 'Order',
        product_id: 'Product',
        date_gte: 'Posted since',
        date_lte: 'Posted before',
        date: 'Date',
        comment: 'Comment',
        rating: 'Rating',
      },
      action: {
        accept: 'Accept',
        reject: 'Reject',
      },
      notification: {
        approved_success: 'Review approved',
        approved_error: 'Error: Review not approved',
        rejected_success: 'Review rejected',
        rejected_error: 'Error: Review not rejected',
      },
    },
    segments: {
      name: 'Segment |||| Segments',
      fields: {
        customers: 'Customers',
        name: 'Name',
      },
      data: {
        compulsive: 'Compulsive',
        collector: 'Collector',
        ordered_once: 'Ordered once',
        regular: 'Regular',
        returns: 'Returns',
        reviewer: 'Reviewer',
      },
    },
  },
};

export default customEnglishMessages;
