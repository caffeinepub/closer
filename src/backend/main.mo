import Iter "mo:core/Iter";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.name, product2.name);
    };
  };

  module Shop {
    public func compare(shop1 : Shop, shop2 : Shop) : Order.Order {
      Text.compare(shop1.name, shop2.name);
    };
  };

  module Notification {
    public func compare(notification1 : Notification, notification2 : Notification) : Order.Order {
      Int.compare(notification1.timestamp, notification2.timestamp);
    };
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    preferredTheme : Text;
  };

  type Shop = {
    id : Nat;
    name : Text;
    description : Text;
    address : Text;
    latitude : Float;
    longitude : Float;
    tiktok : Text;
    whatsapp : Text;
    instagram : Text;
    facebook : Text;
    owner : Principal;
  };

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    image : Storage.ExternalBlob;
    stock : Nat;
    shopId : Nat;
  };

  type Order = {
    id : Nat;
    customerId : Principal;
    productId : Nat;
    shopId : Nat;
    quantity : Nat;
    totalPrice : Nat;
    commissionAmount : Nat;
    status : Text;
    paymentStatus : Text;
    paymentProof : ?Storage.ExternalBlob;
  };

  type Notification = {
    id : Nat;
    ownerId : Principal;
    orderId : Nat;
    message : Text;
    timestamp : Int;
    isRead : Bool;
  };

  var nextShopId = 1;
  var nextProductId = 1;
  var nextOrderId = 1;
  var nextNotificationId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let shops = Map.empty<Nat, Shop>();
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let notifications = Map.empty<Nat, Notification>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func registerProfile(name : Text, email : Text, preferredTheme : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register profiles");
    };
    let profile : UserProfile = {
      name;
      email;
      preferredTheme;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func createShop(name : Text, description : Text, address : Text, latitude : Float, longitude : Float, tiktok : Text, whatsapp : Text, instagram : Text, facebook : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create shops");
    };
    let shop : Shop = {
      id = nextShopId;
      name;
      description;
      address;
      latitude;
      longitude;
      tiktok;
      whatsapp;
      instagram;
      facebook;
      owner = caller;
    };
    shops.add(nextShopId, shop);
    let shopId = nextShopId;
    nextShopId += 1;
    shopId;
  };

  public shared ({ caller }) func updateShop(shopId : Nat, name : Text, description : Text, address : Text, latitude : Float, longitude : Float, tiktok : Text, whatsapp : Text, instagram : Text, facebook : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update shops");
    };
    let existingShop = shops.get(shopId);
    switch (existingShop) {
      case (null) { Runtime.trap("Shop does not exist") };
      case (?shop) {
        if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only shop owner can update this shop");
        };
        let updatedShop : Shop = {
          id = shopId;
          name;
          description;
          address;
          latitude;
          longitude;
          tiktok;
          whatsapp;
          instagram;
          facebook;
          owner = shop.owner;
        };
        shops.add(shopId, updatedShop);
      };
    };
  };

  public shared ({ caller }) func deleteShop(shopId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete shops");
    };
    let existingShop = shops.get(shopId);
    switch (existingShop) {
      case (null) { Runtime.trap("Shop does not exist") };
      case (?shop) {
        if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only shop owner can delete this shop");
        };
        ignore shops.remove(shopId);
        // Also remove all products belonging to this shop
        let shopProducts = products.values().toArray().filter(func(p) { p.shopId == shopId });
        for (product in shopProducts.vals()) {
          ignore products.remove(product.id);
        };
      };
    };
  };

  public shared ({ caller }) func createProduct(name : Text, description : Text, price : Nat, category : Text, image : Storage.ExternalBlob, stock : Nat, shopId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create products");
    };
    let shop = shops.get(shopId);
    switch (shop) {
      case (null) { Runtime.trap("Shop does not exist") };
      case (?shop) {
        if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only shop owner can create products for this shop");
        };
        let product : Product = {
          id = nextProductId;
          name;
          description;
          price;
          category;
          image;
          stock;
          shopId;
        };
        products.add(nextProductId, product);
        let productId = nextProductId;
        nextProductId += 1;
        productId;
      };
    };
  };

  public shared ({ caller }) func updateProduct(productId : Nat, name : Text, description : Text, price : Nat, category : Text, image : Storage.ExternalBlob, stock : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update products");
    };
    let existingProduct = products.get(productId);
    switch (existingProduct) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        let shop = shops.get(product.shopId);
        switch (shop) {
          case (null) { Runtime.trap("Shop does not exist") };
          case (?shop) {
            if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only shop owner can update products");
            };
            let updatedProduct : Product = {
              id = productId;
              name;
              description;
              price;
              category;
              image;
              stock;
              shopId = product.shopId;
            };
            products.add(productId, updatedProduct);
          };
        };
      };
    };
  };

  public shared ({ caller }) func placeOrder(productId : Nat, quantity : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let product = products.get(productId);
    switch (product) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        if (product.stock < quantity) {
          Runtime.trap("Insufficient stock");
        };
        let totalPrice = product.price * quantity;
        let commissionAmount = totalPrice / 10;
        let order : Order = {
          id = nextOrderId;
          customerId = caller;
          productId;
          shopId = product.shopId;
          quantity;
          totalPrice;
          commissionAmount;
          status = "pending";
          paymentStatus = "unpaid";
          paymentProof = null;
        };
        orders.add(nextOrderId, order);
        let orderId = nextOrderId;
        nextOrderId += 1;
        createOrderNotification(product.shopId, orderId);
        orderId;
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update orders");
    };
    let existingOrder = orders.get(orderId);
    switch (existingOrder) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let shop = shops.get(order.shopId);
        switch (shop) {
          case (null) { Runtime.trap("Shop does not exist") };
          case (?shop) {
            if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only shop owner can update order status");
            };
            let updatedOrder : Order = {
              id = orderId;
              customerId = order.customerId;
              productId = order.productId;
              shopId = order.shopId;
              quantity = order.quantity;
              totalPrice = order.totalPrice;
              commissionAmount = order.commissionAmount;
              status;
              paymentStatus = order.paymentStatus;
              paymentProof = order.paymentProof;
            };
            orders.add(orderId, updatedOrder);
          };
        };
      };
    };
  };

  public shared ({ caller }) func updatePaymentProof(orderId : Nat, paymentProof : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update payment proof");
    };
    let existingOrder = orders.get(orderId);
    switch (existingOrder) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (order.customerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only order customer can update payment proof");
        };
        let updatedOrder : Order = {
          id = orderId;
          customerId = order.customerId;
          productId = order.productId;
          shopId = order.shopId;
          quantity = order.quantity;
          totalPrice = order.totalPrice;
          commissionAmount = order.commissionAmount;
          status = order.status;
          paymentStatus = "pending";
          paymentProof = ?paymentProof;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  func createOrderNotification(shopId : Nat, orderId : Nat) {
    let shop = shops.get(shopId);
    switch (shop) {
      case (null) { Runtime.trap("Shop does not exist") };
      case (?shop) {
        let notification : Notification = {
          id = nextNotificationId;
          ownerId = shop.owner;
          orderId;
          message = "New order received!";
          timestamp = 0;
          isRead = false;
        };
        notifications.add(nextNotificationId, notification);
        nextNotificationId += 1;
      };
    };
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };
    let existingNotification = notifications.get(notificationId);
    switch (existingNotification) {
      case (null) { Runtime.trap("Notification does not exist") };
      case (?notification) {
        if (notification.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only mark your own notifications as read");
        };
        let updatedNotification : Notification = {
          id = notificationId;
          ownerId = notification.ownerId;
          orderId = notification.orderId;
          message = notification.message;
          timestamp = notification.timestamp;
          isRead = true;
        };
        notifications.add(notificationId, updatedNotification);
      };
    };
  };

  public query ({ caller }) func getMyNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };
    notifications.values().toArray().filter(func(notification) { notification.ownerId == caller }).sort();
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().toArray().filter(func(order) { order.customerId == caller }).sort(func(a, b) { Nat.compare(a.id, b.id) });
  };

  public query ({ caller }) func getShopOrders(shopId : Nat) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view shop orders");
    };
    let shop = shops.get(shopId);
    switch (shop) {
      case (null) { Runtime.trap("Shop does not exist") };
      case (?shop) {
        if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only shop owner can view shop orders");
        };
        orders.values().toArray().filter(func(order) { order.shopId == shopId }).sort(func(a, b) { Nat.compare(a.id, b.id) });
      };
    };
  };

  public query ({ caller }) func getAllShops() : async [Shop] {
    shops.values().toArray().sort();
  };

  public query ({ caller }) func getShop(shopId : Nat) : async ?Shop {
    shops.get(shopId);
  };

  public query ({ caller }) func getShopProducts(shopId : Nat) : async [Product] {
    products.values().toArray().filter(func(product) { product.shopId == shopId }).sort();
  };

  public query ({ caller }) func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order details");
    };
    let order = orders.get(orderId);
    switch (order) {
      case (null) { null };
      case (?order) {
        let shop = shops.get(order.shopId);
        let isShopOwner = switch (shop) {
          case (null) { false };
          case (?shop) { shop.owner == caller };
        };
        if (order.customerId == caller or isShopOwner or AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders or orders for your shop");
        };
      };
    };
  };
};
