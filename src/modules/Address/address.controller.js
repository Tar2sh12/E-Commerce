import axios from "axios";
import { Address } from "../../../DB/models/index.js";
import { ErrorClass } from "../../utils/index.js";
/**
 * @api {post} /addresses/create  create a new address
 */
export const createAddress = async (req, res, next) => {
  const {
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
    setAsDefault,
  } = req.body;
  const userId = req.authUser._id;
  // todo : cities validation 
  const countryInfo = await axios.get(`https://api.api-ninjas.com/v1/country?name=${country}`,
    {
      headers:{
        "X-Api-Key":process.env.CITY_API_KEY
      }
    }
  )
  
  if(countryInfo.data.length === 0){
    return next(new ErrorClass("Country not found", 404, "Country not found"));
  }
  const validCountry  = countryInfo.data[0].iso2;
  const cities = await axios.get(`https://api.api-ninjas.com/v1/city?country=${validCountry}&&limit=30`,
    {
      headers:{
        "x-api-key":process.env.CITY_API_KEY
      }
    }
  )
  // console.log(cities.data)
  const isCityExist = cities.data.find((c) => c.name === city);
  if(!isCityExist){ 
    return next(new ErrorClass("City not found", 404, "City not found"));
  }
  const newAddress = new Address({
    country:validCountry,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
    userId,
    isDefault: [true, false].includes(setAsDefault) ? setAsDefault : false,
  });
  // if the new address is default , update all other default addresses to false
  if (newAddress.isDefault) {
    await Address.updateOne({ userId, isDefault: true }, { isDefault: false });
  }

  const savedAddress = await newAddress.save();
  res.status(201).json({ message: "Address created", savedAddress });
};
/**
 * @api (put) /addresses/update/:_id  update an address by id
 */
export const updateAddress = async (req, res, next) => {
  const { _id } = req.params;
  const {
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
    setAsDefault,
  } = req.body;
  const userId = req.authUser._id;
  
  const address = await Address.findOne({_id , userId ,isMarkedAsDeleted:false });
  if (!address)
    return next(new ErrorClass("Address not found", 404, "Address not found"));

  if (country) address.country = country;
  if (city) address.city = city;
  if (postalCode) address.postalCode = postalCode;
  if (buildingNumber) address.buildingNumber = buildingNumber;
  if (floorNumber) address.floorNumber = floorNumber;
  if (addressLabel) address.addressLabel = addressLabel;
  if ([true, false].includes(setAsDefault)) {
    address.isDefault = setAsDefault;
    if (setAsDefault && !address.isDefault) {
      await Address.updateOne(
        { userId: address.userId, isDefault: true },
        { isDefault: false }
      );
    }
  }
  await address.save();
  res.status(200).json({ message: "Address updated", address });
};
/**
 * @api (delete) /addresses/soft-delete/:_id  delete an address by id 
 */
export const deleteAddress = async (req, res, next) => {
  const { _id } = req.params;
  const userId=req.authUser._id;
  const address = await Address.findOneAndUpdate(
    { _id, userId , isMarkedAsDeleted: false},
    { isMarkedAsDeleted: true ,isDefault:false},
    { new: true }
  );
  if (!address)
    return next(new ErrorClass("Address not found", 404, "Address not found"));
  res.status(200).json({ message: "Address deleted" });
}

/**
 * @api (get) /addresses/get  get all addresses
 */
export const getAddresses = async (req, res, next) => {
  const userId = req.authUser._id;
  const addresses = await Address.find({ userId, isMarkedAsDeleted: false });
  res.status(200).json({ message: "Addresses found", addresses });
}

export const availableCities = async (req, res, next) => {
  const {country} = req.body;
  const countryInfo = await axios.get(`https://api.api-ninjas.com/v1/country?name=${country}`,
    {
      headers:{
        "X-Api-Key":process.env.CITY_API_KEY
      }
    }
  )
  // console.log(countryInfo.data[0].iso2);
  
  const cities = await axios.get(`https://api.api-ninjas.com/v1/city?country=${countryInfo.data[0].iso2}&&limit=30`,
    {
      headers:{
        "x-api-key":process.env.CITY_API_KEY
      }
    }
  )
  res.status(200).json({ message: "Cities found", cities: cities.data });
}