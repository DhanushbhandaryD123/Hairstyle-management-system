from django.core.management.base import BaseCommand
from api.models import HairstyleCategory, Hairstyle, Salon


class Command(BaseCommand):
    help = 'Seed initial data'

    def handle(self, *args, **kwargs):
        # Categories
        cats = {}
        for name in ['Short', 'Medium', 'Long', 'Curly', 'Color', 'Special Occasion']:
            cat, _ = HairstyleCategory.objects.get_or_create(name=name)
            cats[name] = cat

        # Hairstyles
        hairstyles_data = [
            ('Pixie Cut', 'Short', 'Chic short tapered cut with textured top', 30, 50, 'https://images.unsplash.com/photo-1620122830785-a40d0d2b4f96?w=400'),
            ('Bob Cut', 'Short', 'Classic chin-length bob with clean lines', 45, 65, 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400'),
            ('Layered Bob', 'Medium', 'Modern bob with soft face-framing layers', 60, 80, 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400'),
            ('Beach Waves', 'Medium', 'Effortless tousled texture with salt spray finish', 60, 75, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400'),
            ('Balayage', 'Long', 'Sun-kissed hand-painted color highlights', 180, 220, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'),
            ('Mermaid Waves', 'Long', 'Voluminous flowing waves with glossy finish', 90, 120, 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400'),
            ('Spiral Curls', 'Curly', 'Defined bouncy spiral curls with moisture treatment', 75, 95, 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=400'),
            ('Bridal Updo', 'Special Occasion', 'Elegant pinned updo for weddings and events', 120, 180, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'),
            ('French Braid', 'Special Occasion', 'Classic French braid with loose tendrils', 45, 60, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'),
            ('Highlights', 'Color', 'Multi-tonal foil highlights for depth and dimension', 150, 195, 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400'),
        ]

        hairstyle_objects = []
        for name, cat, desc, dur, price, img in hairstyles_data:
            h, _ = Hairstyle.objects.get_or_create(
                name=name,
                defaults={'category': cats[cat], 'description': desc, 'duration_minutes': dur, 'price': price, 'image_url': img}
            )
            hairstyle_objects.append(h)

        # Salons
        salons_data = [
            ('Luxe Hair Studio', '123 Main Street', 'New York', '+1-555-0101', 40.7128, -74.0060, 4.8,
             'https://images.unsplash.com/photo-1560066984-138daaa0e2c5?w=400'),
            ('The Mane Event', '456 Oak Avenue', 'New York', '+1-555-0102', 40.7589, -73.9851, 4.6,
             'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400'),
            ('Glamour & Glow Spa', '789 Bliss Blvd', 'New York', '+1-555-0103', 40.6892, -73.9442, 4.9,
             'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400'),
            ('Radiant Roots Salon', '321 Pine Lane', 'Brooklyn', '+1-555-0104', 40.6782, -73.9442, 4.5,
             'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=400'),
            ('Silk & Scissors', '654 Maple Drive', 'Queens', '+1-555-0105', 40.7282, -73.7949, 4.7,
             'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=400'),
        ]

        for name, addr, city, phone, lat, lng, rating, img in salons_data:
            salon, created = Salon.objects.get_or_create(
                name=name,
                defaults={'address': addr, 'city': city, 'phone': phone, 'latitude': lat, 'longitude': lng, 'rating': rating, 'image_url': img}
            )
            if created:
                salon.services.set(hairstyle_objects)

        self.stdout.write(self.style.SUCCESS('✅ Seed data loaded successfully!'))
