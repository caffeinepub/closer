import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Order "mo:core/Order";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Notification {
    public func compare(notification1 : Notification, notification2 : Notification) : Order.Order {
      Int.compare(notification1.timestamp, notification2.timestamp);
    };
  };

  module PaymentReference {
    public func compare(a : PaymentReference, b : PaymentReference) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Shop {
    public func compare(a : Shop, b : Shop) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  public type ShopRole = {
    #owner;
    #admin;
    #customer;
    #shopBrowser;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    email : Text;
    preferredTheme : Text;
    profilePicture : ?Storage.ExternalBlob;
  };

  public type AppSettings = {
    platformPaymentNumber : Text;
  };

  public type Shop = {
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
    logo : ?Storage.ExternalBlob;
    paymentNumbers : Text;
    subscriptionExpiry : Int;
    isActive : Bool;
  };

  public type ShopWithAvailability = {
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
    logo : ?Storage.ExternalBlob;
    paymentNumbers : Text;
    subscriptionExpiry : Int;
    isActive : Bool;
    isAvailable : Bool;
    category : Text;
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    image : Storage.ExternalBlob;
    stock : Nat;
    shopId : Nat;
  };

  public type Order = {
    id : Nat;
    customerId : Principal;
    customerName : Text;
    customerPhone : Text;
    productId : Nat;
    shopId : Nat;
    quantity : Nat;
    totalPrice : Nat;
    commissionAmount : Nat;
    status : Text;
    paymentStatus : Text;
    paymentProof : ?Storage.ExternalBlob;
    paymentNote : Text;
  };

  public type Notification = {
    id : Nat;
    ownerId : Principal;
    orderId : Nat;
    message : Text;
    timestamp : Int;
    isRead : Bool;
  };

  public type PaymentReference = {
    id : Nat;
    shopId : Nat;
    shopName : Text;
    ownerId : Principal;
    ownerName : Text;
    referenceNumber : Text;
    status : Text;
    submittedAt : Int;
  };


  public type AppFeedback = {
    id : Nat;
    userId : Principal;
    userName : Text;
    rating : Nat;
    comment : Text;
    timestamp : Int;
  };

  public type ShopReview = {
    id : Nat;
    shopId : Nat;
    userId : Principal;
    userName : Text;
    rating : Nat;
    comment : Text;
    timestamp : Int;
  };


  var nextShopId = 1;
  var nextProductId = 1;
  var nextOrderId = 1;
  var nextNotificationId = 1;
  var nextPaymentReferenceId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let shops = Map.empty<Nat, Shop>();
  let shopAvailability = Map.empty<Nat, Bool>();
  let shopCategories = Map.empty<Nat, Text>();
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let notifications = Map.empty<Nat, Notification>();
  let paymentReferences = Map.empty<Nat, PaymentReference>();
  var nextFeedbackId = 1;
  let feedbacks = Map.empty<Nat, AppFeedback>();
  var nextShopReviewId = 1;
  let shopReviews = Map.empty<Nat, ShopReview>();

  var appSettings : AppSettings = {
    platformPaymentNumber = "16334291";
  };

  // Helper: ensure caller is registered in access control.
  // First-ever caller becomes admin; subsequent callers become regular users.
  // getUserRole now returns #guest for unknown users (no trap), so this is safe.
  func ensureRegistered(caller : Principal) {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous users cannot register") };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      if (not accessControlState.adminAssigned) {
        accessControlState.userRoles.add(caller, #admin);
        accessControlState.adminAssigned := true;
      } else {
        accessControlState.userRoles.add(caller, #user);
      };
    };
  };

  func withAvailability(shop : Shop) : ShopWithAvailability {
    let avail = switch (shopAvailability.get(shop.id)) {
      case (null) { true };
      case (?v) { v };
    };
    {
      id = shop.id;
      name = shop.name;
      description = shop.description;
      address = shop.address;
      latitude = shop.latitude;
      longitude = shop.longitude;
      tiktok = shop.tiktok;
      whatsapp = shop.whatsapp;
      instagram = shop.instagram;
      facebook = shop.facebook;
      owner = shop.owner;
      logo = shop.logo;
      paymentNumbers = shop.paymentNumbers;
      subscriptionExpiry = shop.subscriptionExpiry;
      isActive = shop.isActive;
      isAvailable = avail;
      category = switch (shopCategories.get(shop.id)) { case (null) { "" }; case (?c) { c } };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return null;
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      return null;
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllUserProfiles() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      return [];
    };
    userProfiles.toArray();
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    ensureRegistered(caller);
    userProfiles.add(caller, profile);
  };

  // First caller becomes admin; all others become regular users.
  public shared ({ caller }) func registerProfile(name : Text, phone : Text, email : Text, preferredTheme : Text) : async () {
    ensureRegistered(caller);
    let profile : UserProfile = {
      name;
      phone;
      email;
      preferredTheme;
      profilePicture = null;
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateProfilePicture(callerProfilePicture : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profile pictures");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile does not exist") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          phone = profile.phone;
          email = profile.email;
          preferredTheme = profile.preferredTheme;
          profilePicture = ?callerProfilePicture;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return null;
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getAppSettings() : async AppSettings {
    appSettings;
  };

  public shared ({ caller }) func updateAppSettings(platformPaymentNumber : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update app settings");
    };
    appSettings := {
      platformPaymentNumber;
    };
  };

  public shared ({ caller }) func createShop(name : Text, description : Text, address : Text, latitude : Float, longitude : Float, tiktok : Text, whatsapp : Text, instagram : Text, facebook : Text, category : Text) : async Nat {
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
      logo = null;
      paymentNumbers = "";
      subscriptionExpiry = 0;
      isActive = true;
    };
    shops.add(nextShopId, shop);
    shopAvailability.add(nextShopId, true);
    shopCategories.add(nextShopId, category);
    let shopId = nextShopId;
    nextShopId += 1;
    shopId;
  };

  public shared ({ caller }) func toggleShopAvailability(shopId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle shop availability");
    };
    switch (shops.get(shopId)) {
      case (null) { Runtime.trap("Shop does not exist") };
      case (?shop) {
        if (shop.owner != caller) {
          Runtime.trap("Unauthorized: Only shop owner can toggle availability");
        };
        let current = switch (shopAvailability.get(shopId)) {
          case (null) { true };
          case (?v) { v };
        };
        let newVal = not current;
        shopAvailability.add(shopId, newVal);
        // Also update isActive on the shop for consistency
        let updatedShop : Shop = {
          id = shop.id;
          name = shop.name;
          description = shop.description;
          address = shop.address;
          latitude = shop.latitude;
          longitude = shop.longitude;
          tiktok = shop.tiktok;
          whatsapp = shop.whatsapp;
          instagram = shop.instagram;
          facebook = shop.facebook;
          owner = shop.owner;
          logo = shop.logo;
          paymentNumbers = shop.paymentNumbers;
          subscriptionExpiry = shop.subscriptionExpiry;
          isActive = newVal;
        };
        shops.add(shopId, updatedShop);
        newVal;
      };
    };
  };

  public shared ({ caller }) func updateShopLogo(shopId : Nat, shopLogo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update shop logos");
    };
    switch (shops.get(shopId)) {
      case (null) { Runtime.trap("Shop does not exist") };
      case (?shop) {
        if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only shop owner can update this shop");
        };
        let updatedShop : Shop = {
          id = shopId;
          name = shop.name;
          description = shop.description;
          address = shop.address;
          latitude = shop.latitude;
          longitude = shop.longitude;
          tiktok = shop.tiktok;
          whatsapp = shop.whatsapp;
          instagram = shop.instagram;
          facebook = shop.facebook;
          owner = shop.owner;
          logo = ?shopLogo;
          paymentNumbers = shop.paymentNumbers;
          subscriptionExpiry = shop.subscriptionExpiry;
          isActive = shop.isActive;
        };
        shops.add(shopId, updatedShop);
      };
    };
  };

  public shared ({ caller }) func updateShopPaymentNumbers(shopId : Nat, paymentNumbers : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update payment numbers");
    };
    switch (shops.get(shopId)) {
      case (null) { Runtime.trap("Shop does not exist") };
      case (?shop) {
        if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only shop owner can update payment numbers");
        };
        let updatedShop : Shop = {
          id = shopId;
          name = shop.name;
          description = shop.description;
          address = shop.address;
          latitude = shop.latitude;
          longitude = shop.longitude;
          tiktok = shop.tiktok;
          whatsapp = shop.whatsapp;
          instagram = shop.instagram;
          facebook = shop.facebook;
          owner = shop.owner;
          logo = shop.logo;
          paymentNumbers;
          subscriptionExpiry = shop.subscriptionExpiry;
          isActive = shop.isActive;
        };
        shops.add(shopId, updatedShop);
      };
    };
  };

  public shared ({ caller }) func updateShop(shopId : Nat, name : Text, description : Text, address : Text, latitude : Float, longitude : Float, tiktok : Text, whatsapp : Text, instagram : Text, facebook : Text, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update shops");
    };
    switch (shops.get(shopId)) {
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
          logo = shop.logo;
          paymentNumbers = shop.paymentNumbers;
          subscriptionExpiry = shop.subscriptionExpiry;
          isActive = shop.isActive;
        };
        shops.add(shopId, updatedShop);
        shopCategories.add(shopId, category);
      };
    };
  };

  public shared ({ caller }) func deleteShop(shopId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete shops");
    };
    switch (shops.get(shopId)) {
      case (null) { Runtime.trap("Shop does not exist") };
      case (?shop) {
        if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only shop owner can delete this shop");
        };
        shops.remove(shopId);
        shopAvailability.remove(shopId);
      };
    };
  };

  public shared ({ caller }) func createProduct(name : Text, description : Text, price : Nat, category : Text, image : Storage.ExternalBlob, stock : Nat, shopId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create products");
    };
    switch (shops.get(shopId)) {
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
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        switch (shops.get(product.shopId)) {
          case (null) { Runtime.trap("Shop does not exist") };
          case (?shop) {
            if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only shop owner can update products for this shop");
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

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete products");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        switch (shops.get(product.shopId)) {
          case (null) { Runtime.trap("Shop does not exist") };
          case (?shop) {
            if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only shop owner can delete products for this shop");
            };
            products.remove(productId);
          };
        };
      };
    };
  };

  public shared ({ caller }) func placeOrder(productId : Nat, quantity : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        if (product.stock < quantity) {
          Runtime.trap("Insufficient stock");
        };
        let totalPrice = product.price * quantity;
        let commissionAmount : Nat = totalPrice * 10 / 100;
        switch (userProfiles.get(caller)) {
          case (null) { Runtime.trap("User profile does not exist") };
          case (?userProfile) {
            let order : Order = {
              id = nextOrderId;
              customerId = caller;
              customerName = userProfile.name;
              customerPhone = userProfile.phone;
              productId;
              shopId = product.shopId;
              quantity;
              totalPrice;
              commissionAmount;
              status = "pending";
              paymentStatus = "unpaid";
              paymentProof = null;
              paymentNote = "";
            };
            orders.add(nextOrderId, order);
            let orderId = nextOrderId;
            nextOrderId += 1;
            createOrderNotification(product.shopId, orderId, product.name);
            orderId;
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update orders");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        switch (shops.get(order.shopId)) {
          case (null) { Runtime.trap("Shop does not exist") };
          case (?shop) {
            if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only shop owner can update status of orders for this shop");
            };
            let updatedOrder : Order = {
              id = orderId;
              customerId = order.customerId;
              customerName = order.customerName;
              customerPhone = order.customerPhone;
              productId = order.productId;
              shopId = order.shopId;
              quantity = order.quantity;
              totalPrice = order.totalPrice;
              commissionAmount = order.commissionAmount;
              status;
              paymentStatus = order.paymentStatus;
              paymentProof = order.paymentProof;
              paymentNote = order.paymentNote;
            };
            orders.add(orderId, updatedOrder);
          };
        };
      };
    };
  };

  public shared ({ caller }) func uploadPaymentProof(orderId : Nat, paymentProof : Storage.ExternalBlob, paymentNote : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload payment proof");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (order.customerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only order customer can upload payment proof");
        };
        let updatedOrder : Order = {
          id = orderId;
          customerId = order.customerId;
          customerName = order.customerName;
          customerPhone = order.customerPhone;
          productId = order.productId;
          shopId = order.shopId;
          quantity = order.quantity;
          totalPrice = order.totalPrice;
          commissionAmount = order.commissionAmount;
          status = order.status;
          paymentStatus = "pending";
          paymentProof = ?paymentProof;
          paymentNote;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func updatePaymentNote(orderId : Nat, paymentNote : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update payment notes");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (order.customerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only order customer can update payment note");
        };
        let updatedOrder : Order = {
          id = orderId;
          customerId = order.customerId;
          customerName = order.customerName;
          customerPhone = order.customerPhone;
          productId = order.productId;
          shopId = order.shopId;
          quantity = order.quantity;
          totalPrice = order.totalPrice;
          commissionAmount = order.commissionAmount;
          status = order.status;
          paymentStatus = "pending";
          paymentProof = order.paymentProof;
          paymentNote;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  func createOrderNotification(shopId : Nat, orderId : Nat, productName : Text) {
    switch (shops.get(shopId)) {
      case (null) { };
      case (?shop) {
        let notification : Notification = {
          id = nextNotificationId;
          ownerId = shop.owner;
          orderId;
          message = "Agizo jipya: " # productName;
          timestamp = Time.now();
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
    switch (notifications.get(notificationId)) {
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
      return [];
    };
    notifications.values().toArray().filter(func(notification) { notification.ownerId == caller }).sort();
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    orders.values().toArray().filter(func(order) { order.customerId == caller }).sort(func(a, b) { Nat.compare(a.id, b.id) });
  };

  public query ({ caller }) func getShopOrders(shopId : Nat) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return [];
    };
    switch (shops.get(shopId)) {
      case (null) { Runtime.trap("Shop does not exist") };
      case (?shop) {
        if (shop.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only shop owner can view shop orders");
        };
        orders.values().toArray().filter(func(order) { order.shopId == shopId }).sort(func(a, b) { Nat.compare(a.id, b.id) });
      };
    };
  };

  public query ({ caller }) func getAllOrdersAdmin() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      return [];
    };
    orders.values().toArray().sort(func(a, b) { Nat.compare(a.id, b.id) });
  };

  public query ({ caller }) func getShopsByCategory(category : Text) : async [ShopWithAvailability] {
    shops.values().toArray().filter(func(shop) { switch (shopCategories.get(shop.id)) { case (?c) { c == category }; case (null) { false } } }).map(withAvailability);
  };

  public query ({ caller }) func getActiveShopsByCategory(category : Text) : async [ShopWithAvailability] {
    shops.values().toArray().filter(func(shop) { shop.isActive and (switch (shopCategories.get(shop.id)) { case (?c) { c == category }; case (null) { false } }) }).map(withAvailability);
  };

  public query ({ caller }) func getAllShops() : async [ShopWithAvailability] {
    shops.values().toArray().map(withAvailability);
  };

  public query ({ caller }) func getShop(shopId : Nat) : async ?ShopWithAvailability {
    switch (shops.get(shopId)) {
      case (null) { null };
      case (?shop) { ?withAvailability(shop) };
    };
  };

  public query ({ caller }) func getShopProducts(shopId : Nat) : async [Product] {
    products.values().toArray().filter(func(product) { product.shopId == shopId });
  };

  public query ({ caller }) func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return null;
    };
    switch (orders.get(orderId)) {
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
          null;
        };
      };
    };
  };

  public query ({ caller }) func getActiveShops() : async [ShopWithAvailability] {
    shops.values().toArray().filter(func(shop) { shop.isActive }).map(withAvailability);
  };

  public shared ({ caller }) func submitAppFeedback(rating : Nat, comment : Text) : async Nat {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous users cannot submit feedback") };
    if (rating < 1 or rating > 5) { Runtime.trap("Rating must be between 1 and 5") };
    let userName = switch (userProfiles.get(caller)) {
      case (?profile) { profile.name };
      case (null) { "Mtumiaji" };
    };
    let id = nextFeedbackId;
    nextFeedbackId += 1;
    feedbacks.add(id, {
      id;
      userId = caller;
      userName;
      rating;
      comment;
      timestamp = Time.now();
    });
    id
  };

  public query func getAppFeedbacks() : async [AppFeedback] {
    feedbacks.values().toArray().sort(func(a, b) { Int.compare(b.timestamp, a.timestamp) })
  };

  // Returns (totalRatingX10, count) to avoid Float -- frontend divides by 10 to get average
  public query func getAverageRating() : async (Nat, Nat) {
    let all = feedbacks.values().toArray();
    let count = all.size();
    if (count == 0) { return (0, 0) };
    var total = 0;
    for (fb in all.vals()) { total += fb.rating };
    (total * 10 / count, count)
  };


  // Allows anyone to claim admin if no admin has been assigned yet.
  public shared ({ caller }) func claimAdminIfNoneYet() : async Bool {
    if (caller.isAnonymous()) { return false };
    if (accessControlState.adminAssigned) { return false };
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    true
  };

  // Allows an existing admin to promote any user to admin.
  public shared ({ caller }) func promoteUserToAdmin(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can promote users");
    };
    accessControlState.userRoles.add(user, #admin);
  };

  // Force reset admin and claim for caller. Protected by secret code "ctm2026".
  public shared ({ caller }) func forceResetAndClaimAdmin(secret : Text) : async Bool {
    if (caller.isAnonymous()) { return false };
    if (secret != "ctm2026") { return false };
    for ((p, role) in accessControlState.userRoles.toArray().vals()) {
      switch (role) {
        case (#admin) { accessControlState.userRoles.remove(p) };
        case (_) {};
      };
    };
    accessControlState.adminAssigned := false;
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    true
  };
  // Admin confirms payment for an order
  public shared ({ caller }) func confirmPayment(orderId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can confirm payments");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updated : Order = {
          id = order.id;
          customerId = order.customerId;
          customerName = order.customerName;
          customerPhone = order.customerPhone;
          productId = order.productId;
          shopId = order.shopId;
          quantity = order.quantity;
          totalPrice = order.totalPrice;
          commissionAmount = order.commissionAmount;
          status = order.status;
          paymentStatus = "confirmed";
          paymentProof = order.paymentProof;
          paymentNote = order.paymentNote;
        };
        orders.add(orderId, updated);
      };
    };
  };

  // Admin rejects payment for an order
  public shared ({ caller }) func rejectPayment(orderId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can reject payments");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updated : Order = {
          id = order.id;
          customerId = order.customerId;
          customerName = order.customerName;
          customerPhone = order.customerPhone;
          productId = order.productId;
          shopId = order.shopId;
          quantity = order.quantity;
          totalPrice = order.totalPrice;
          commissionAmount = order.commissionAmount;
          status = order.status;
          paymentStatus = "rejected";
          paymentProof = order.paymentProof;
          paymentNote = order.paymentNote;
        };
        orders.add(orderId, updated);
      };
    };
  };



  // Add a review for a shop
  public shared ({ caller }) func addShopReview(shopId : Nat, rating : Nat, comment : Text) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous users cannot review") };
    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("Not registered") };
    };
    let clampedRating = if (rating < 1) 1 else if (rating > 5) 5 else rating;
    let id = nextShopReviewId;
    nextShopReviewId += 1;
    let review : ShopReview = {
      id;
      shopId;
      userId = caller;
      userName = profile.name;
      rating = clampedRating;
      comment;
      timestamp = Time.now();
    };
    shopReviews.add(id, review);
  };

  // Get all reviews for a shop
  public query func getShopReviews(shopId : Nat) : async [ShopReview] {
    shopReviews.values().toArray()
      |> Array.filter(_, func(r : ShopReview) : Bool { r.shopId == shopId })
      |> Array.sort(_, func(a : ShopReview, b : ShopReview) : Order.Order { Int.compare(b.timestamp, a.timestamp) })
  };

  // Get average rating for a shop: returns (totalRating * 10 / count, count) to avoid floats
  public query func getShopAverageRating(shopId : Nat) : async (Nat, Nat) {
    let reviews = shopReviews.values().toArray()
      |> Array.filter(_, func(r : ShopReview) : Bool { r.shopId == shopId });
    let count = reviews.size();
    if (count == 0) { return (0, 0) };
    var total = 0;
    for (r in reviews.vals()) { total += r.rating };
    (total * 10 / count, count)
  };

};
