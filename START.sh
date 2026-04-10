#!/bin/bash
echo ""
echo "======================================"
echo "  SAKHI BEAUTY PARLOUR APP"
echo "  Ranjana Ji - Gorakhpur"  
echo "======================================"
echo ""
echo "📦 Backend install + setup..."
cd backend && npm install && npm run seed &
sleep 6
echo "🎨 Frontend install + start..."
cd ../frontend && npm install && npm run dev &
echo ""
echo "======================================"
echo "  http://localhost:5173 kholiye"
echo "  Admin: 9936657399 / sakhi@2025"
echo "======================================"
