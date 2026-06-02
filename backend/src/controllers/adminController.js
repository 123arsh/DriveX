export async function getAdminDashboard(req, res) {
  res.json({
    activeRentals: 42,
    totalVehicles: 235,
    revenue: 1280000,
    pendingVerifications: 18,
  });
}
