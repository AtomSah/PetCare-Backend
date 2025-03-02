const Pet = require('../models/Pet');

// Get all pets
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pets by type (cat, dog, etc.)
const getPetsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const pets = await Pet.find({ type: { $regex: new RegExp(type, 'i') } });
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pet by id
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new pet (admin only)
const createPet = async (req, res) => {
  try {
    const { name, type, breed, age, gender, weight, color, location, price, description, vaccinated } = req.body;
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Pet image is required' });
    }

    const imagePath = `/uploads/pets/${req.file.filename}`;

    const pet = await Pet.create({
      name,
      type,
      breed,
      age,
      gender,
      weight,
      color,
      location,
      price,
      description,
      vaccinated: vaccinated === 'true',
      image: imagePath,
      available: true
    });

    res.status(201).json({ message: 'Pet added successfully', pet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update pet (admin only)
const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;
    
    // If a new image is uploaded
    if (req.file) {
      updateData.image = `/uploads/pets/${req.file.filename}`;
    }

    // Convert vaccinated string to boolean if present
    if (updateData.vaccinated) {
      updateData.vaccinated = updateData.vaccinated === 'true';
    }

    const pet = await Pet.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.status(200).json({ message: 'Pet updated successfully', pet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete pet (admin only)
const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByIdAndDelete(id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllPets,
  getPetsByType,
  getPetById,
  createPet,
  updatePet,
  deletePet
};