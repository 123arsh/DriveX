import Vehicle from '../models/vehicleModel.js';

export async function getVehicles(req, res, next) {
  try {
    const { type, category, brand, search, page = 1, limit = 12 } = req.query;
    const query = { availabilityStatus: 'available' };

    if (type) query.vehicleType = type;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (search) query.$text = { $search: search };

    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Vehicle.countDocuments(query);
    res.json({ data: vehicles, meta: { page: Number(page), limit: Number(limit), total } });
  } catch (error) {
    next(error);
  }
}

export async function getVehicleBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const vehicle = await Vehicle.findOne({ slug });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
}
