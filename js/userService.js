var userStorage = (function () {

    function User(username, password) {
        this.username = username;
        this.password = password;
        this.id = UserStorage.nextId;
        this.basket = new CartStorage();
        this.favorites = [];
        this.orders = [];
        this.addresses = [];
        this.cards = [];
    }


    function UserStorage() {
        this._users = [];
        this.loggedUserId = 0;
    }


    UserStorage.nextId = 1;


    UserStorage.prototype.register = function (username, password) {
        if ((username.trim().length == 0) || (password.trim().length < 8)){
            return false;
        }

        var isAlreadyRegistered = (this._users.find(user => user.username == username) != null);

        if (!isAlreadyRegistered) {
            var newUser = new User(username, password);
            this._users.push(newUser);
            return true;
        }

        return false;
    };


    UserStorage.prototype.login = function (username, password) {
        var user = this._users.find(function (u) {
            return u.username === username && u.password === password;
        });

        if (user != null) {
            this.loggedUserId = user.id;
            return true;
        }

        return false;
    };


    UserStorage.prototype.logout = function () {
        this.loggedUserId = 0;
    };


    UserStorage.prototype.purchase = function (userId) {
        var index = this._users.find(user => user.id == userId);

        if (index != -1) {
            var user = this._users[index];
            var newOrder = JSON.parse(JSON.stringify(user.basket));
            user.orders.push(newOrder);
            user.basket.emptyCart();
        }
    };


    UserStorage.prototype.addToFavorites = function (userId, product) {
        var index = this._users.find(user => user.id == userId);

        if (index != -1) {
            this._users[index].favorites.push(product);
            return true;
        }

        return false;
    };


    UserStorage.prototype.addAddress = function (userId, fullName, phoneNumber, city, postcode, streetAddress) {
        var index = this._users.find(user => user.id == userId);

        if (index != -1) {
            var newAddress = new Address(fullName, phoneNumber, city, postcode, streetAddress);
            this._users[index].addresses.push(newAddress);
            return true;
        }

        return false;
    };


    UserStorage.prototype.addCard = function (userId, nameOnCard, cardNumber, expirationDate) {
        var index = this._users.find(user => user.id == userId);

        if (index != -1) {
            var newCard = new Card(nameOnCard, cardNumber, expirationDate);
            this._users[index].cards.push(newCard);
            return true;
        }

        return false;
    };


    function Address (fullName, phoneNumber, city, postcode, streetAddress) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.city = city;
        this.postcode = postcode;
        this.streetAddress = streetAddress;
    }


    function Card (nameOnCard, cardNumber, expirationDate) {
        this.nameOnCard = nameOnCard;
        this.cardNumber = cardNumber;
        this.expirationDate = expirationDate;
    }

    return new UserStorage();
})();