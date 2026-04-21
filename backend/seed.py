"""
Seed script — popula a base de dados com artigos e serviços iniciais.
Idempotente: se um artigo/serviço com o mesmo slug já existir, não cria de novo.

Uso:
    cd backend
    python seed.py
"""
from datetime import date
from app.database import SessionLocal, engine, Base
from app.models import Article, Service


ARTICLES = [
    {
        "title": "It's About Tyla",
        "slug": "about-tyla",
        "excerpt": "From Johannesburg to the Coachella stage — an afternoon with the voice of a new era.",
        "content": "Tyla walks in wearing a grey hoodie and the calm of someone who already knows how the story ends. We met at a studio in Maboneng, two hours before soundcheck...",
        "cover_image": "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=1600&q=80",
        "category": "Cover Story",
        "author": "Nicolaia Rips",
        "publish_date": date(2026, 4, 20),
        "is_published": True,
        "is_featured": True,
    },
    {
        "title": "Ugly Ducklings to Swans",
        "slug": "ugly-ducklings",
        "excerpt": "A cast of cool people revisit the awkward eras that quietly shaped them.",
        "content": "Everyone has a braces era. Everyone has a side-part era. This is the story of how the awkward became the aesthetic...",
        "cover_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
        "category": "Beauty",
        "author": "Carlota Staff",
        "publish_date": date(2026, 4, 19),
        "is_published": True,
        "is_featured": True,
    },
    {
        "title": "Dress-Up! With Dr. Karen Doherty",
        "slug": "dress-up-doherty",
        "excerpt": "The London fashion girls' aesthetic practitioner of choice.",
        "content": "Dr Karen Doherty — aka Dr KD — is the reason a certain kind of London girl looks permanently well-rested...",
        "cover_image": "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=80",
        "category": "Beauty",
        "author": "Nellie Eden",
        "publish_date": date(2026, 4, 18),
        "is_published": True,
        "is_featured": False,
    },
    {
        "title": "Miss Claire Sullivan, nice to meet you",
        "slug": "claire-sullivan",
        "excerpt": "Pop's favorite custom couturier walks us through designing a Coachella look.",
        "content": "Claire Sullivan's studio is covered in fabric. Feathers. A Polaroid of PinkPantheress pinned to the wall. This is where the dresses happen.",
        "cover_image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
        "category": "Fashion",
        "author": "Nicolaia Rips",
        "publish_date": date(2026, 4, 17),
        "is_published": True,
        "is_featured": False,
    },
    {
        "title": "Desert Dress-Up! With Slayyyter",
        "slug": "desert-slayyyter",
        "excerpt": "The gritty pop girl on rage, optimization and wearing exactly what she wants.",
        "content": "Slayyyter arrives at Coachella in 40°C heat wearing leather. This is entirely on purpose.",
        "cover_image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
        "category": "Culture",
        "author": "Flora Medina",
        "publish_date": date(2026, 4, 16),
        "is_published": True,
        "is_featured": False,
    },
    {
        "title": "Straight-Ups! Barcelona",
        "slug": "straight-ups-barcelona",
        "excerpt": "080 Barcelona Fashion Week brought youthful energy to the runway.",
        "content": "Outside the shows is where the real show happens. A photo diary from 080 Barcelona.",
        "cover_image": "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=1200&q=80",
        "category": "Fashion",
        "author": "Flora Medina",
        "publish_date": date(2026, 4, 15),
        "is_published": True,
        "is_featured": False,
    },
    {
        "title": "Gucci makes silk feel new again",
        "slug": "gucci-silk",
        "excerpt": "From archival scarves to Flora prints reborn — The Art of Silk.",
        "content": "Demna's first silk capsule for the house reaches into the archive and pulls out something that feels surprisingly now.",
        "cover_image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        "category": "Fashion",
        "author": "Ch'lita",
        "publish_date": date(2026, 4, 14),
        "is_published": True,
        "is_featured": False,
    },
    {
        "title": "Adéla just dropped 'KGB'",
        "slug": "adela-kgb",
        "excerpt": "A sharp new single, a revisit of her Carlota story.",
        "content": "Two years after she appeared on our pages, Adéla returns with her most confident track yet.",
        "cover_image": "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=1200&q=80",
        "category": "Music",
        "author": "Pedro Almeida",
        "publish_date": date(2026, 4, 13),
        "is_published": True,
        "is_featured": False,
    },
]


SERVICES = [
    {
        "title": "Assessoria em Relações Públicas",
        "slug": "assessoria-relacoes-publicas",
        "description": "Estratégias de comunicação personalizadas para posicionar a tua marca. Gestão de imagem, relações com a imprensa e narrativa editorial.",
        "icon": "Megaphone",
        "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
        "order": 1,
        "is_active": True,
    },
    {
        "title": "Patrocínio na Magazine",
        "slug": "patrocinio-magazine",
        "description": "Anúncios, conteúdos patrocinados e eventos exclusivos na Carlota — do print ao digital.",
        "icon": "BookOpen",
        "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&q=80",
        "order": 2,
        "is_active": True,
    },
    {
        "title": "Direção de Arte",
        "slug": "direcao-arte",
        "description": "Conceitos visuais únicos para campanhas, editoriais e projetos especiais.",
        "icon": "Palette",
        "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
        "order": 3,
        "is_active": True,
    },
    {
        "title": "Produção Fotográfica",
        "slug": "producao-fotografica",
        "description": "Ensaios e campanhas chave-na-mão. Do casting à pós-produção.",
        "icon": "Camera",
        "image": "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80",
        "order": 4,
        "is_active": True,
    },
    {
        "title": "Gestão de Eventos",
        "slug": "gestao-eventos",
        "description": "Lançamentos, exposições e festas com identidade editorial.",
        "icon": "Users",
        "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
        "order": 5,
        "is_active": True,
    },
    {
        "title": "Consultoria de Marca",
        "slug": "consultoria-marca",
        "description": "Trabalho profundo de branding que gera resultados duradouros.",
        "icon": "Award",
        "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
        "order": 6,
        "is_active": True,
    },
]


def seed():
    # Garantir que as tabelas existem
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    created_articles = 0
    skipped_articles = 0
    created_services = 0
    skipped_services = 0

    try:
        # Articles
        for data in ARTICLES:
            exists = db.query(Article).filter(Article.slug == data["slug"]).first()
            if exists:
                skipped_articles += 1
                continue
            db.add(Article(**data))
            created_articles += 1

        # Services
        for data in SERVICES:
            exists = db.query(Service).filter(Service.slug == data["slug"]).first()
            if exists:
                skipped_services += 1
                continue
            db.add(Service(**data))
            created_services += 1

        db.commit()

        print(f"\n✓ Seed concluído")
        print(f"  Articles: {created_articles} criados, {skipped_articles} já existiam")
        print(f"  Services: {created_services} criados, {skipped_services} já existiam")
    except Exception as e:
        db.rollback()
        print(f"\n✗ Erro no seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
