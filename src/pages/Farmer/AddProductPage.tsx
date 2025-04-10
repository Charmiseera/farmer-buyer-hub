
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { productService } from '../../services/mockData';
import { Calendar, Image, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const AddProductPage: React.FC = () => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    cropName: '',
    description: '',
    quantity: '',
    unit: 'kg',
    price: '',
    image: '',
    availableUntil: ''
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear field-specific error
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prevErrors => ({
        ...prevErrors,
        image: 'Image size must be less than 5MB'
      }));
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prevData => ({
        ...prevData,
        image: base64String
      }));
      setPreviewImage(base64String);
      
      // Clear image error
      if (errors.image) {
        setErrors(prevErrors => ({
          ...prevErrors,
          image: ''
        }));
      }
    };
    reader.readAsDataURL(file);
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.cropName.trim()) {
      newErrors.cropName = 'Crop name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.availableUntil) {
      newErrors.availableUntil = 'Availability date is required';
    } else {
      const selectedDate = new Date(formData.availableUntil);
      const currentDate = new Date();
      
      if (selectedDate <= currentDate) {
        newErrors.availableUntil = 'Availability date must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!authState.user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to add a product.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const productData = {
        cropName: formData.cropName,
        description: formData.description,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        price: Number(formData.price),
        image: formData.image || 'https://via.placeholder.com/400x300?text=No+Image',
        availableUntil: formData.availableUntil,
        farmerId: authState.user.id,
        farmerName: authState.user.name,
        location: authState.user.location
      };
      
      await productService.createProduct(productData);
      
      toast({
        title: "Product Added",
        description: "Your product has been added to the marketplace.",
        variant: "default"
      });
      
      navigate('/farmer-dashboard');
      
    } catch (err) {
      console.error('Error adding product:', err);
      toast({
        title: "Failed to Add Product",
        description: "There was an error adding your product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-agri-green to-agri-light-green py-8 px-4">
        <div className="agri-container">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Product</h1>
          <p className="text-white/90">
            List your agricultural products in the marketplace for buyers to discover.
          </p>
        </div>
      </div>
      
      <div className="agri-container py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Information */}
            <div>
              <h2 className="text-xl font-semibold text-agri-dark mb-4">Product Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cropName" className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Name*
                  </label>
                  <input
                    type="text"
                    id="cropName"
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleChange}
                    className={`agri-input w-full ${errors.cropName ? 'border-red-500' : ''}`}
                    placeholder="e.g. Organic Tomatoes"
                  />
                  {errors.cropName && (
                    <p className="mt-1 text-sm text-red-600">{errors.cropName}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity*
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      step="0.1"
                      className={`agri-input w-full ${errors.quantity ? 'border-red-500' : ''}`}
                      placeholder="100"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                      Unit*
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className={`agri-input w-full ${errors.unit ? 'border-red-500' : ''}`}
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="lb">Pound (lb)</option>
                      <option value="g">Gram (g)</option>
                      <option value="dozen">Dozen</option>
                      <option value="piece">Piece</option>
                      <option value="box">Box</option>
                      <option value="crate">Crate</option>
                      <option value="bushel">Bushel</option>
                      <option value="ton">Ton</option>
                    </select>
                    {errors.unit && (
                      <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price per {formData.unit}*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      className={`agri-input w-full pl-8 ${errors.price ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="availableUntil" className="block text-sm font-medium text-gray-700 mb-1">
                    Available Until*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="availableUntil"
                      name="availableUntil"
                      value={formData.availableUntil}
                      onChange={handleChange}
                      className={`agri-input w-full pl-10 ${errors.availableUntil ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.availableUntil && (
                    <p className="mt-1 text-sm text-red-600">{errors.availableUntil}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`agri-input w-full ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe your product (freshness, quality, growing methods, etc.)"
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Product Image */}
            <div>
              <h2 className="text-xl font-semibold text-agri-dark mb-4">Product Image</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image (optional)
                  </label>
                  <div className="mt-1 flex items-center">
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Image className="h-5 w-5 mr-2" />
                      <span>Choose file</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, or JPEG up to 5MB
                  </p>
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                  )}
                </div>
                
                <div>
                  <div className="aspect-w-4 aspect-h-3">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Product preview"
                        className="h-36 w-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-36 bg-gray-200 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300">
                        <span className="text-gray-500 text-sm">No image selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="agri-button-primary flex items-center justify-center min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Adding Product...
                  </>
                ) : (
                  'Add Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddProductPage;
