/* =====================================================
   Database Types
   أنواع TypeScript لقاعدة البيانات
   يتم توليدها تلقائياً من Supabase
===================================================== */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// =====================================================
// أنواع الجداول
// =====================================================
export interface Database {
    public: {
        Tables: {
            // جدول المستخدمين
            users: {
                Row: {
                    id: string
                    name: string
                    email: string
                    phone: string | null
                    password_hash: string | null
                    gender: 'male' | 'female' | null
                    birth_date: string | null
                    role: 'super_admin' | 'admin' | 'staff' | 'user'
                    wallet_balance: number
                    affiliate_code: string | null
                    referred_by: string | null
                    nickname: string | null
                    is_verified: boolean
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    phone?: string | null
                    password_hash?: string | null
                    gender?: 'male' | 'female' | null
                    birth_date?: string | null
                    role?: 'super_admin' | 'admin' | 'staff' | 'user'
                    wallet_balance?: number
                    affiliate_code?: string | null
                    referred_by?: string | null
                    nickname?: string | null
                    is_verified?: boolean
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    password_hash?: string | null
                    gender?: 'male' | 'female' | null
                    birth_date?: string | null
                    role?: 'super_admin' | 'admin' | 'staff' | 'user'
                    wallet_balance?: number
                    affiliate_code?: string | null
                    referred_by?: string | null
                    nickname?: string | null
                    is_verified?: boolean
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }

            // جدول الترابيزات
            tables: {
                Row: {
                    id: string
                    name: string
                    table_number: number
                    image_url: string | null
                    price_per_hour_per_person: number
                    capacity_min: number
                    capacity_max: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    table_number: number
                    image_url?: string | null
                    price_per_hour_per_person: number
                    capacity_min?: number
                    capacity_max: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    table_number?: number
                    image_url?: string | null
                    price_per_hour_per_person?: number
                    capacity_min?: number
                    capacity_max?: number
                    is_active?: boolean
                    created_at?: string
                }
            }

            // جدول المنتجات
            products: {
                Row: {
                    id: string
                    name: string
                    name_ar: string | null
                    description: string | null
                    type: 'food' | 'drink' | 'supply' | 'equipment'
                    price: number
                    cost_price: number
                    stock_quantity: number
                    min_stock_alert: number
                    is_for_sale: boolean
                    is_for_internal_use: boolean
                    image_url: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    name_ar?: string | null
                    description?: string | null
                    type: 'food' | 'drink' | 'supply' | 'equipment'
                    price: number
                    cost_price?: number
                    stock_quantity?: number
                    min_stock_alert?: number
                    is_for_sale?: boolean
                    is_for_internal_use?: boolean
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    name_ar?: string | null
                    description?: string | null
                    type?: 'food' | 'drink' | 'supply' | 'equipment'
                    price?: number
                    cost_price?: number
                    stock_quantity?: number
                    min_stock_alert?: number
                    is_for_sale?: boolean
                    is_for_internal_use?: boolean
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }

            // جدول الجلسات
            sessions: {
                Row: {
                    id: string
                    table_id: string
                    start_time: string
                    end_time: string | null
                    status: 'active' | 'pending_payment' | 'closed'
                    table_price: number
                    products_price: number
                    total_price: number
                    payment_method: 'cash' | 'visa' | 'wallet' | null
                    payment_details: string | null
                    is_paid: boolean
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    table_id: string
                    start_time?: string
                    end_time?: string | null
                    status?: 'active' | 'pending_payment' | 'closed'
                    table_price?: number
                    products_price?: number
                    total_price?: number
                    payment_method?: 'cash' | 'visa' | 'wallet' | null
                    payment_details?: string | null
                    is_paid?: boolean
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    table_id?: string
                    start_time?: string
                    end_time?: string | null
                    status?: 'active' | 'pending_payment' | 'closed'
                    table_price?: number
                    products_price?: number
                    total_price?: number
                    payment_method?: 'cash' | 'visa' | 'wallet' | null
                    payment_details?: string | null
                    is_paid?: boolean
                    created_by?: string | null
                    created_at?: string
                }
            }

            // جدول أعضاء الجلسة
            session_members: {
                Row: {
                    id: string
                    session_id: string
                    user_id: string | null
                    guest_name: string | null
                    joined_at: string
                }
                Insert: {
                    id?: string
                    session_id: string
                    user_id?: string | null
                    guest_name?: string | null
                    joined_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string
                    user_id?: string | null
                    guest_name?: string | null
                    joined_at?: string
                }
            }

            // جدول طلبات الجلسة
            session_orders: {
                Row: {
                    id: string
                    session_id: string
                    product_id: string
                    quantity: number
                    price_at_time: number
                    total_price: number
                    ordered_by: string | null
                    status: 'pending' | 'delivered' | 'cancelled'
                    created_at: string
                }
                Insert: {
                    id?: string
                    session_id: string
                    product_id: string
                    quantity?: number
                    price_at_time: number
                    total_price: number
                    ordered_by?: string | null
                    status?: 'pending' | 'delivered' | 'cancelled'
                    created_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string
                    product_id?: string
                    quantity?: number
                    price_at_time?: number
                    total_price?: number
                    ordered_by?: string | null
                    status?: 'pending' | 'delivered' | 'cancelled'
                    created_at?: string
                }
            }

            // جدول ليالي الألعاب
            game_nights: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    event_date: string
                    start_time: string
                    end_time: string | null
                    entry_fee: number
                    total_prizes_value: number
                    status: 'upcoming' | 'ongoing' | 'completed'
                    image_url: string | null
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    event_date: string
                    start_time: string
                    end_time?: string | null
                    entry_fee?: number
                    total_prizes_value?: number
                    status?: 'upcoming' | 'ongoing' | 'completed'
                    image_url?: string | null
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    event_date?: string
                    start_time?: string
                    end_time?: string | null
                    entry_fee?: number
                    total_prizes_value?: number
                    status?: 'upcoming' | 'ongoing' | 'completed'
                    image_url?: string | null
                    created_by?: string | null
                    created_at?: string
                }
            }

            // جدول البطولات
            tournaments: {
                Row: {
                    id: string
                    game_night_id: string
                    game_name: string
                    prize_first: number
                    prize_second: number
                    prize_third: number
                    status: 'upcoming' | 'ongoing' | 'completed'
                    created_at: string
                }
                Insert: {
                    id?: string
                    game_night_id: string
                    game_name: string
                    prize_first?: number
                    prize_second?: number
                    prize_third?: number
                    status?: 'upcoming' | 'ongoing' | 'completed'
                    created_at?: string
                }
                Update: {
                    id?: string
                    game_night_id?: string
                    game_name?: string
                    prize_first?: number
                    prize_second?: number
                    prize_third?: number
                    status?: 'upcoming' | 'ongoing' | 'completed'
                    created_at?: string
                }
            }

            // جدول المشاركين في البطولات
            tournament_participants: {
                Row: {
                    id: string
                    tournament_id: string
                    user_id: string
                    rank: 1 | 2 | 3 | null
                    prize_won: number
                    registered_at: string
                }
                Insert: {
                    id?: string
                    tournament_id: string
                    user_id: string
                    rank?: 1 | 2 | 3 | null
                    prize_won?: number
                    registered_at?: string
                }
                Update: {
                    id?: string
                    tournament_id?: string
                    user_id?: string
                    rank?: 1 | 2 | 3 | null
                    prize_won?: number
                    registered_at?: string
                }
            }

            // جدول سجل النظافة
            cleaning_logs: {
                Row: {
                    id: string
                    log_date: string
                    time_slot: string
                    area: 'bathroom' | 'hall' | 'kitchen' | 'entrance'
                    status: 'checked' | 'missed'
                    checked_by: string | null
                    checked_at: string | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    log_date?: string
                    time_slot: string
                    area: 'bathroom' | 'hall' | 'kitchen' | 'entrance'
                    status?: 'checked' | 'missed'
                    checked_by?: string | null
                    checked_at?: string | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    log_date?: string
                    time_slot?: string
                    area?: 'bathroom' | 'hall' | 'kitchen' | 'entrance'
                    status?: 'checked' | 'missed'
                    checked_by?: string | null
                    checked_at?: string | null
                    notes?: string | null
                    created_at?: string
                }
            }

            // جدول طلبات المكان
            requests: {
                Row: {
                    id: string
                    type: 'supply' | 'maintenance' | 'food' | 'drink' | 'other'
                    item_name: string
                    description: string | null
                    quantity: number
                    estimated_cost: number
                    status: 'pending' | 'received' | 'completed'
                    requested_by: string | null
                    approved_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    type: 'supply' | 'maintenance' | 'food' | 'drink' | 'other'
                    item_name: string
                    description?: string | null
                    quantity?: number
                    estimated_cost?: number
                    status?: 'pending' | 'received' | 'completed'
                    requested_by?: string | null
                    approved_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    type?: 'supply' | 'maintenance' | 'food' | 'drink' | 'other'
                    item_name?: string
                    description?: string | null
                    quantity?: number
                    estimated_cost?: number
                    status?: 'pending' | 'received' | 'completed'
                    requested_by?: string | null
                    approved_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }

            // جدول مصروفات المكان
            expenses: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    amount: number
                    category: 'rent' | 'utilities' | 'salary' | 'supplies' | 'maintenance' | 'other'
                    expense_date: string
                    receipt_url: string | null
                    added_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    amount: number
                    category?: 'rent' | 'utilities' | 'salary' | 'supplies' | 'maintenance' | 'other'
                    expense_date?: string
                    receipt_url?: string | null
                    added_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    amount?: number
                    category?: 'rent' | 'utilities' | 'salary' | 'supplies' | 'maintenance' | 'other'
                    expense_date?: string
                    receipt_url?: string | null
                    added_by?: string | null
                    created_at?: string
                }
            }

            // جدول بيانات الموظفين
            employees: {
                Row: {
                    id: string
                    user_id: string
                    national_id: string | null
                    national_id_image_url: string | null
                    address: string | null
                    emergency_contact: string | null
                    salary: number
                    shift: 'morning' | 'evening' | 'night' | 'full'
                    hire_date: string
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    national_id?: string | null
                    national_id_image_url?: string | null
                    address?: string | null
                    emergency_contact?: string | null
                    salary?: number
                    shift?: 'morning' | 'evening' | 'night' | 'full'
                    hire_date?: string
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    national_id?: string | null
                    national_id_image_url?: string | null
                    address?: string | null
                    emergency_contact?: string | null
                    salary?: number
                    shift?: 'morning' | 'evening' | 'night' | 'full'
                    hire_date?: string
                    is_active?: boolean
                    created_at?: string
                }
            }

            // جدول المهام
            tasks: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    priority: 'low' | 'medium' | 'high'
                    deadline: string | null
                    status: 'pending' | 'in_progress' | 'completed' | 'overdue'
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    priority?: 'low' | 'medium' | 'high'
                    deadline?: string | null
                    status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    priority?: 'low' | 'medium' | 'high'
                    deadline?: string | null
                    status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }

            // جدول الحجوزات
            bookings: {
                Row: {
                    id: string
                    user_id: string
                    booking_date: string
                    start_time: string
                    end_time: string | null
                    people_count: number
                    deposit_amount: number
                    table_id: string | null
                    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    payment_reference: string | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    booking_date: string
                    start_time: string
                    end_time?: string | null
                    people_count?: number
                    deposit_amount?: number
                    table_id?: string | null
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    payment_reference?: string | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    booking_date?: string
                    start_time?: string
                    end_time?: string | null
                    people_count?: number
                    deposit_amount?: number
                    table_id?: string | null
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    payment_reference?: string | null
                    notes?: string | null
                    created_at?: string
                }
            }

            // جدول الإشعارات
            notifications: {
                Row: {
                    id: string
                    user_id: string | null
                    title: string
                    body: string
                    type: 'general' | 'booking' | 'session' | 'task' | 'promo' | 'reminder'
                    is_read: boolean
                    action_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    title: string
                    body: string
                    type?: 'general' | 'booking' | 'session' | 'task' | 'promo' | 'reminder'
                    is_read?: boolean
                    action_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    title?: string
                    body?: string
                    type?: 'general' | 'booking' | 'session' | 'task' | 'promo' | 'reminder'
                    is_read?: boolean
                    action_url?: string | null
                    created_at?: string
                }
            }

            // جدول ملاحظات المستخدم
            notes: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    content: string | null
                    is_pinned: boolean
                    color: string
                    folder_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title?: string
                    content?: string | null
                    is_pinned?: boolean
                    color?: string
                    folder_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    content?: string | null
                    is_pinned?: boolean
                    color?: string
                    folder_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }

            // جدول محادثات صميده AI
            ai_conversations: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    created_at?: string
                    updated_at?: string
                }
            }

            // جدول رسائل صميده AI
            ai_messages: {
                Row: {
                    id: string
                    conversation_id: string
                    role: 'user' | 'assistant'
                    content: string
                    tokens_used: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    conversation_id: string
                    role: 'user' | 'assistant'
                    content: string
                    tokens_used?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    conversation_id?: string
                    role?: 'user' | 'assistant'
                    content?: string
                    tokens_used?: number
                    created_at?: string
                }
            }

            // جدول معاملات المحفظة
            wallet_transactions: {
                Row: {
                    id: string
                    user_id: string
                    type: 'deposit' | 'withdrawal' | 'session_payment' | 'affiliate_earning' | 'refund'
                    amount: number
                    balance_after: number
                    reference_id: string | null
                    payment_method: string | null
                    payment_reference: string | null
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'deposit' | 'withdrawal' | 'session_payment' | 'affiliate_earning' | 'refund'
                    amount: number
                    balance_after: number
                    reference_id?: string | null
                    payment_method?: string | null
                    payment_reference?: string | null
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'deposit' | 'withdrawal' | 'session_payment' | 'affiliate_earning' | 'refund'
                    amount?: number
                    balance_after?: number
                    reference_id?: string | null
                    payment_method?: string | null
                    payment_reference?: string | null
                    description?: string | null
                    created_at?: string
                }
            }

            // جدول البانرات
            banners: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    image_url: string
                    link_url: string | null
                    is_active: boolean
                    start_date: string | null
                    end_date: string | null
                    display_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    image_url: string
                    link_url?: string | null
                    is_active?: boolean
                    start_date?: string | null
                    end_date?: string | null
                    display_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    image_url?: string
                    link_url?: string | null
                    is_active?: boolean
                    start_date?: string | null
                    end_date?: string | null
                    display_order?: number
                    created_at?: string
                }
            }
        }
    }
}

// =====================================================
// أنواع مساعدة
// =====================================================
export type User = Database['public']['Tables']['users']['Row']
export type Table = Database['public']['Tables']['tables']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type SessionMember = Database['public']['Tables']['session_members']['Row']
export type SessionOrder = Database['public']['Tables']['session_orders']['Row']
export type GameNight = Database['public']['Tables']['game_nights']['Row']
export type Tournament = Database['public']['Tables']['tournaments']['Row']
export type CleaningLog = Database['public']['Tables']['cleaning_logs']['Row']
export type Request = Database['public']['Tables']['requests']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type Employee = Database['public']['Tables']['employees']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Note = Database['public']['Tables']['notes']['Row']
export type AIConversation = Database['public']['Tables']['ai_conversations']['Row']
export type AIMessage = Database['public']['Tables']['ai_messages']['Row']
export type WalletTransaction = Database['public']['Tables']['wallet_transactions']['Row']
export type Banner = Database['public']['Tables']['banners']['Row']
