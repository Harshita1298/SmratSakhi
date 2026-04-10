#!/bin/bash
echo "==================================="
echo "  SAKHI BEAUTY PARLOUR APP"
echo "  Ranjana Ji - Gorakhpur"
echo "==================================="
echo ""
echo "Backend shuru ho raha hai..."
cd backend && npm install && npm run seed &
sleep 5
echo "Frontend shuru ho raha hai..."
cd ../frontend && npm install && npm run dev &
echo ""
echo "App kholiye: http://localhost:5173"
echo "Admin: 9999999999 / admin123"
