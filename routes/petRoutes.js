const express = require('express');
const { 
  getAllPets,
  getPetsByType,
  getPetById,
  createPet,
  updatePet,
  deletePet
} = require('../controllers/petController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const { uploadPetImage } = require('../config/multerConfig');
const router = express.Router();

// Public routes - no authentication needed
router.get('/', getAllPets);
router.get('/type/:type', getPetsByType);
router.get('/:id', getPetById);

// Admin routes - with authentication
router.post('/', isAuthenticated, isAdmin, uploadPetImage, createPet);
router.put('/:id', isAuthenticated, isAdmin, uploadPetImage, updatePet);
router.delete('/:id', isAuthenticated, isAdmin, deletePet);

module.exports = router;