import React,{useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Header from './componanents/Header/Header';
import Banner from './componanents/Banner/Banner';
import Foods from './componanents/Foods/Foods';
import Features from './componanents/Features/Features';
import Footer from './componanents/Footer/Footer';
import FoodDetails from './componanents/FoodDetails/FoodDetails';
import SearchResult from './componanents/SearchResult/SearchResult';
import Shipment from './componanents/Shipment/Shipment';
import OrderComplete from './componanents/OrderComplete/OrderComplete';
import {AuthProvider, PrivateRoute, useAuth  } from './componanents/SignUp/useAuth';
import NotFound from './componanents/NotFound/NotFound';
import SignUp from './componanents/SignUp/SignUp';
import Inventory from './componanents/Inventory/Inventory';


function App() {
    
    const [cart , setCart] = useState([]);
    const [orderId , setOrderId] = useState(null);
    
    const [deliveryDetails , setDeliveryDetails] = useState({
      todoor:null,road:null, flat:null, businessname:null, address: null
    });
  
    const [userEmail, setUserEmail] = useState(null);
    const deliveryDetailsHandler = (data) => {
        setDeliveryDetails(data)
    }
    const getUserEmail = (email) => {
      setUserEmail(email)
    }

    const clearCart =  () => {
      const orderedItems = cart.map(cartItem => {
        return {food_id : cartItem.id, quantity: cartItem.quantity}
      })

      const orderDetailsData = { userEmail , orderedItems,  deliveryDetails }
      fetch('https://stark-chamber-45335.herokuapp.com/submitorder' , {
          method : "POST",
          headers: {
              "Content-type" : "application/json"
          },
          body : JSON.stringify(orderDetailsData)
      })
      .then(res => res.json())
      .then(data=> setOrderId(data._id))
      console.log(orderId);

      setCart([])
    }

    const cartHandler = (data) => {
      const alreadyAdded = cart.find(crt => crt.id == data.id );
      const newCart = [...cart,data]
      setCart(newCart);
      if(alreadyAdded){
        const reamingCarts = cart.filter(crt => cart.id != data);
        setCart(reamingCarts);
      }else{
        const newCart = [...cart,data]
        setCart(newCart);
      }
     
    }

    const checkOutItemHandler = (productId, productQuantity) => {
      const newCart = cart.map(item => {
        if(item.id == productId){
            item.quantity = productQuantity;
        }
        return item;
      })

      const filteredCart = newCart.filter(item => item.quantity > 0)
      setCart(filteredCart)
    }
   
  return (
    <AuthProvider>
      <Router>
        <div className="main">
          <Switch>
            <Route exact path="/">
                <Header cart={cart}/>
                <Banner/>
                <Foods cart={cart}></Foods>
                <Features/>
                <Footer/>
            </Route>
            <Route path="/food/:id">
                <Header cart={cart} />
                <FoodDetails cart={cart} cartHandler={cartHandler} />
                <Footer/>
            </Route>
            <Route path="/search=:searchQuery">
                <Header cart={cart}/>
                <Banner/>
                <SearchResult/>
                <Features/>
                <Footer/>
            </Route>
            <PrivateRoute path="/checkout">
                <Header cart={cart}/>
                <Shipment deliveryDetails={deliveryDetails} deliveryDetailsHandler={deliveryDetailsHandler} cart={cart} clearCart={clearCart} checkOutItemHandler={checkOutItemHandler} getUserEmail={getUserEmail}/>
                <Footer/>
            </PrivateRoute>
            <PrivateRoute path="/order-complete">
              <Header cart={cart}/>
              <OrderComplete deliveryDetails={deliveryDetails} orderId={orderId}/>
              <Footer/>
            </PrivateRoute>
            <Route path="/inventory">
              <Header cart={cart}/>
              <Inventory></Inventory>
              <Footer/>
            </Route>
            <Route path="/login">
              <SignUp/>
            </Route>
            <Route path="*">
                <NotFound/>
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
