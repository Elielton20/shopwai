-- =========================================
-- SCRIPT COMPLETO PARA CONFIGURAR O BANCO DE DADOS SUPABASE
-- APLICAÇÃO SHOPWAI E-COMMERCE
-- =========================================

-- PASSO 1: Desabilitar confirmação de email
-- Vá em: Authentication > Settings > Email Auth
-- Desmarque: "Enable email confirmations"
-- OU execute este SQL (necessita permissões de admin):
-- UPDATE auth.config SET enable_email_confirmations = false;

-- =========================================
-- PASSO 2: Criar tabelas
-- =========================================

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('cliente', 'vendedor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de carrinho
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- PASSO 3: Criar índices para performance
-- =========================================

CREATE INDEX IF NOT EXISTS idx_products_vendor ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- =========================================
-- PASSO 4: Configurar Row Level Security (RLS)
-- =========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas para products
CREATE POLICY "Todos podem ver produtos"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendedores podem criar produtos"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = vendor_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tipo_usuario = 'vendedor'
    )
  );

CREATE POLICY "Vendedores podem atualizar seus próprios produtos"
  ON public.products FOR UPDATE
  TO authenticated
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendedores podem deletar seus próprios produtos"
  ON public.products FOR DELETE
  TO authenticated
  USING (auth.uid() = vendor_id);

-- Políticas para cart_items
CREATE POLICY "Usuários podem ver seu próprio carrinho"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem adicionar ao seu carrinho"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio carrinho"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar de seu próprio carrinho"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para orders
CREATE POLICY "Usuários podem ver seus próprios pedidos"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios pedidos"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para order_items
CREATE POLICY "Usuários podem ver itens de seus próprios pedidos"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem criar itens de seus próprios pedidos"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- =========================================
-- PASSO 5: Criar função para criar perfil automaticamente
-- =========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, tipo_usuario)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cliente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para executar a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- PASSO 6: Inserir produtos de exemplo (opcional)
-- =========================================

-- Primeiro, crie um usuário vendedor de teste via interface do Supabase ou cadastro
-- Depois substitua 'SEU_VENDOR_ID' pelo ID real do vendedor

-- INSERT INTO public.products (name, price, image_url, vendor_id) VALUES
-- ('Farinha de Mandioca', 15.00, '/placeholder.svg?height=200&width=200', 'SEU_VENDOR_ID'),
-- ('Banana', 5.00, '/placeholder.svg?height=200&width=200', 'SEU_VENDOR_ID'),
-- ('Açaí', 25.00, '/placeholder.svg?height=200&width=200', 'SEU_VENDOR_ID'),
-- ('Castanha', 20.00, '/placeholder.svg?height=200&width=200', 'SEU_VENDOR_ID');

-- =========================================
-- FIM DO SCRIPT
-- =========================================

-- INSTRUÇÕES:
-- 1. Copie todo este script
-- 2. Vá ao Supabase Dashboard > SQL Editor
-- 3. Cole e execute o script
-- 4. Configure as variáveis de ambiente no projeto:
--    - NEXT_PUBLIC_SUPABASE_URL
--    - NEXT_PUBLIC_SUPABASE_ANON_KEY
--    - SUPABASE_SERVICE_ROLE_KEY
-- 5. Descomente as linhas do código que usam o Supabase
