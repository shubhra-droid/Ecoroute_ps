const express = require("express");
const axios = require("axios");
const calculateCarbon = require("../utils/carbon");

const router = express.Router();

router.post("/route",async(req,res)=>{

const {start,end,mode} = req.body;

const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

try{

const response = await axios.get(url);

const route = response.data.routes[0];

const distance = route.distance;
const duration = route.duration;

const carbon = calculateCarbon(distance,mode);

res.json({
distance,
duration,
carbon,
geometry:route.geometry
});

}catch(err){

res.status(500).json({error:"Routing failed"});

}

});

module.exports = router;