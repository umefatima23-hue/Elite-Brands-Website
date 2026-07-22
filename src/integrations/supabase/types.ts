export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string | null
          admin_role: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown
          metadata: Json
          summary: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          admin_role?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json
          summary?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          admin_role?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json
          summary?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      airtable_connections: {
        Row: {
          base_id: string
          created_at: string
          created_by: string | null
          default_direction: Database["public"]["Enums"]["sync_direction"]
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean
          last_successful_sync_at: string | null
          metadata: Json
          name: string
          sync_statistics: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          base_id: string
          created_at?: string
          created_by?: string | null
          default_direction?: Database["public"]["Enums"]["sync_direction"]
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          last_successful_sync_at?: string | null
          metadata?: Json
          name: string
          sync_statistics?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          base_id?: string
          created_at?: string
          created_by?: string | null
          default_direction?: Database["public"]["Enums"]["sync_direction"]
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          last_successful_sync_at?: string | null
          metadata?: Json
          name?: string
          sync_statistics?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      airtable_external_ids: {
        Row: {
          airtable_record_id: string
          airtable_table: string
          connection_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["sync_entity_type"]
          id: string
          is_active: boolean
          last_source: Database["public"]["Enums"]["source_system"] | null
          last_sync_hash: string | null
          last_synced_at: string | null
          metadata: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          airtable_record_id: string
          airtable_table: string
          connection_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["sync_entity_type"]
          id?: string
          is_active?: boolean
          last_source?: Database["public"]["Enums"]["source_system"] | null
          last_sync_hash?: string | null
          last_synced_at?: string | null
          metadata?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          airtable_record_id?: string
          airtable_table?: string
          connection_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["sync_entity_type"]
          id?: string
          is_active?: boolean
          last_source?: Database["public"]["Enums"]["source_system"] | null
          last_sync_hash?: string | null
          last_synced_at?: string | null
          metadata?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "airtable_external_ids_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "airtable_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      airtable_sync_conflicts: {
        Row: {
          airtable_record_id: string | null
          airtable_table: string | null
          conflict_type: Database["public"]["Enums"]["sync_conflict_type"]
          connection_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          detected_at: string
          diff: Json | null
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["sync_entity_type"]
          external_id_ref: string | null
          id: string
          local_snapshot: Json | null
          metadata: Json
          remote_snapshot: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["sync_conflict_status"]
          sync_log_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          airtable_record_id?: string | null
          airtable_table?: string | null
          conflict_type: Database["public"]["Enums"]["sync_conflict_type"]
          connection_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          detected_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_type: Database["public"]["Enums"]["sync_entity_type"]
          external_id_ref?: string | null
          id?: string
          local_snapshot?: Json | null
          metadata?: Json
          remote_snapshot?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["sync_conflict_status"]
          sync_log_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          airtable_record_id?: string | null
          airtable_table?: string | null
          conflict_type?: Database["public"]["Enums"]["sync_conflict_type"]
          connection_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          detected_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["sync_entity_type"]
          external_id_ref?: string | null
          id?: string
          local_snapshot?: Json | null
          metadata?: Json
          remote_snapshot?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["sync_conflict_status"]
          sync_log_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "airtable_sync_conflicts_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "airtable_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "airtable_sync_conflicts_external_id_ref_fkey"
            columns: ["external_id_ref"]
            isOneToOne: false
            referencedRelation: "airtable_external_ids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "airtable_sync_conflicts_sync_log_id_fkey"
            columns: ["sync_log_id"]
            isOneToOne: false
            referencedRelation: "airtable_sync_log"
            referencedColumns: ["id"]
          },
        ]
      }
      airtable_sync_cursors: {
        Row: {
          airtable_table: string
          connection_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          direction: Database["public"]["Enums"]["sync_direction"]
          entity_type: Database["public"]["Enums"]["sync_entity_type"]
          id: string
          last_cursor: string | null
          last_error: string | null
          last_error_at: string | null
          last_success_at: string | null
          last_synced_at: string | null
          metadata: Json
          records_processed: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          airtable_table: string
          connection_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          direction: Database["public"]["Enums"]["sync_direction"]
          entity_type: Database["public"]["Enums"]["sync_entity_type"]
          id?: string
          last_cursor?: string | null
          last_error?: string | null
          last_error_at?: string | null
          last_success_at?: string | null
          last_synced_at?: string | null
          metadata?: Json
          records_processed?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          airtable_table?: string
          connection_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          direction?: Database["public"]["Enums"]["sync_direction"]
          entity_type?: Database["public"]["Enums"]["sync_entity_type"]
          id?: string
          last_cursor?: string | null
          last_error?: string | null
          last_error_at?: string | null
          last_success_at?: string | null
          last_synced_at?: string | null
          metadata?: Json
          records_processed?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "airtable_sync_cursors_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "airtable_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      airtable_sync_log: {
        Row: {
          airtable_record_id: string | null
          airtable_table: string | null
          batch_id: string | null
          completed_at: string | null
          connection_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          direction: Database["public"]["Enums"]["sync_direction"]
          duration_ms: number | null
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["sync_entity_type"]
          error_code: string | null
          error_message: string | null
          external_id_ref: string | null
          id: string
          idempotency_key: string | null
          is_bulk: boolean
          is_incremental: boolean
          last_error_at: string | null
          max_retries: number
          metadata: Json
          next_retry_at: string | null
          operation: string
          payload_snapshot: Json | null
          request_hash: string | null
          response_snapshot: Json | null
          retry_count: number
          source_system: Database["public"]["Enums"]["source_system"]
          started_at: string
          status: Database["public"]["Enums"]["sync_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          airtable_record_id?: string | null
          airtable_table?: string | null
          batch_id?: string | null
          completed_at?: string | null
          connection_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          direction: Database["public"]["Enums"]["sync_direction"]
          duration_ms?: number | null
          entity_id?: string | null
          entity_type: Database["public"]["Enums"]["sync_entity_type"]
          error_code?: string | null
          error_message?: string | null
          external_id_ref?: string | null
          id?: string
          idempotency_key?: string | null
          is_bulk?: boolean
          is_incremental?: boolean
          last_error_at?: string | null
          max_retries?: number
          metadata?: Json
          next_retry_at?: string | null
          operation?: string
          payload_snapshot?: Json | null
          request_hash?: string | null
          response_snapshot?: Json | null
          retry_count?: number
          source_system?: Database["public"]["Enums"]["source_system"]
          started_at?: string
          status?: Database["public"]["Enums"]["sync_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          airtable_record_id?: string | null
          airtable_table?: string | null
          batch_id?: string | null
          completed_at?: string | null
          connection_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          direction?: Database["public"]["Enums"]["sync_direction"]
          duration_ms?: number | null
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["sync_entity_type"]
          error_code?: string | null
          error_message?: string | null
          external_id_ref?: string | null
          id?: string
          idempotency_key?: string | null
          is_bulk?: boolean
          is_incremental?: boolean
          last_error_at?: string | null
          max_retries?: number
          metadata?: Json
          next_retry_at?: string | null
          operation?: string
          payload_snapshot?: Json | null
          request_hash?: string | null
          response_snapshot?: Json | null
          retry_count?: number
          source_system?: Database["public"]["Enums"]["source_system"]
          started_at?: string
          status?: Database["public"]["Enums"]["sync_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "airtable_sync_log_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "airtable_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "airtable_sync_log_external_id_ref_fkey"
            columns: ["external_id_ref"]
            isOneToOne: false
            referencedRelation: "airtable_external_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          end_at: string | null
          id: string
          is_active: boolean
          link_href: string | null
          message: string
          meta: Json
          priority: number
          start_at: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          end_at?: string | null
          id?: string
          is_active?: boolean
          link_href?: string | null
          message: string
          meta?: Json
          priority?: number
          start_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          end_at?: string | null
          id?: string
          is_active?: boolean
          link_href?: string | null
          message?: string
          meta?: Json
          priority?: number
          start_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          blocked_until: string | null
          created_at: string
          endpoint: string | null
          id: string
          identifier: string
          last_request_at: string
          limit_value: number
          metadata: Json
          request_count: number
          scope: string
          updated_at: string
          window_seconds: number
          window_start: string
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string
          endpoint?: string | null
          id?: string
          identifier: string
          last_request_at?: string
          limit_value?: number
          metadata?: Json
          request_count?: number
          scope: string
          updated_at?: string
          window_seconds?: number
          window_start?: string
        }
        Update: {
          blocked_until?: string | null
          created_at?: string
          endpoint?: string | null
          id?: string
          identifier?: string
          last_request_at?: string
          limit_value?: number
          metadata?: Json
          request_count?: number
          scope?: string
          updated_at?: string
          window_seconds?: number
          window_start?: string
        }
        Relationships: []
      }
      application_settings: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          environment: string
          id: string
          is_public: boolean
          is_secret: boolean
          key: string
          metadata: Json
          updated_at: string
          updated_by: string | null
          value: Json
          value_type: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          environment?: string
          id?: string
          is_public?: boolean
          is_secret?: boolean
          key: string
          metadata?: Json
          updated_at?: string
          updated_by?: string | null
          value?: Json
          value_type?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          environment?: string
          id?: string
          is_public?: boolean
          is_secret?: boolean
          key?: string
          metadata?: Json
          updated_at?: string
          updated_by?: string | null
          value?: Json
          value_type?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id: string | null
          actor_role: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          diff: Json | null
          entity_id: string | null
          entity_pk: string | null
          entity_type: string
          id: string
          ip_address: unknown
          metadata: Json
          notes: string | null
          request_id: string | null
          session_id: string | null
          source: string
          user_agent: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          actor_role?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_pk?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          notes?: string | null
          request_id?: string | null
          session_id?: string | null
          source?: string
          user_agent?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          actor_role?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_pk?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          notes?: string | null
          request_id?: string | null
          session_id?: string | null
          source?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      background_jobs: {
        Row: {
          attempts: number
          completed_at: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          idempotency_key: string | null
          job_type: string
          last_error: string | null
          locked_at: string | null
          locked_by: string | null
          max_attempts: number
          metadata: Json
          next_retry_at: string | null
          payload: Json
          priority: Database["public"]["Enums"]["job_priority"]
          queue: string
          reference_id: string | null
          reference_type: string | null
          result: Json | null
          run_after: string
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          attempts?: number
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          idempotency_key?: string | null
          job_type: string
          last_error?: string | null
          locked_at?: string | null
          locked_by?: string | null
          max_attempts?: number
          metadata?: Json
          next_retry_at?: string | null
          payload?: Json
          priority?: Database["public"]["Enums"]["job_priority"]
          queue?: string
          reference_id?: string | null
          reference_type?: string | null
          result?: Json | null
          run_after?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          attempts?: number
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          idempotency_key?: string | null
          job_type?: string
          last_error?: string | null
          locked_at?: string | null
          locked_by?: string | null
          max_attempts?: number
          metadata?: Json
          next_retry_at?: string | null
          payload?: Json
          priority?: Database["public"]["Enums"]["job_priority"]
          queue?: string
          reference_id?: string | null
          reference_type?: string | null
          result?: Json | null
          run_after?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          country_of_origin: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          hero_image_url: string | null
          id: string
          is_featured: boolean
          logo_url: string | null
          meta: Json
          name: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["product_status"]
          tagline: string | null
          updated_at: string
          updated_by: string | null
          website_url: string | null
        }
        Insert: {
          country_of_origin?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          meta?: Json
          name: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          tagline?: string | null
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
        }
        Update: {
          country_of_origin?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          meta?: Json
          name?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          tagline?: string | null
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          meta: Json
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          meta?: Json
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          meta?: Json
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          brand_id: string | null
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          end_date: string | null
          hero_image_url: string | null
          id: string
          is_featured: boolean
          launch_date: string | null
          meta: Json
          name: string
          season: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
          updated_by: string | null
          year: number | null
        }
        Insert: {
          brand_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          launch_date?: string | null
          meta?: Json
          name: string
          season?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          updated_by?: string | null
          year?: number | null
        }
        Update: {
          brand_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          launch_date?: string | null
          meta?: Json
          name?: string
          season?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          updated_by?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_season_fk"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "season_types"
            referencedColumns: ["code"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          address_type: Database["public"]["Enums"]["address_type"]
          city: string
          country: string
          created_at: string
          created_by: string | null
          customer_id: string
          deleted_at: string | null
          id: string
          is_default_billing: boolean
          is_default_shipping: boolean
          label: string | null
          line1: string
          line2: string | null
          meta: Json
          notes: string | null
          phone: string | null
          postal_code: string | null
          province: string | null
          recipient_name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address_type?: Database["public"]["Enums"]["address_type"]
          city: string
          country?: string
          created_at?: string
          created_by?: string | null
          customer_id: string
          deleted_at?: string | null
          id?: string
          is_default_billing?: boolean
          is_default_shipping?: boolean
          label?: string | null
          line1: string
          line2?: string | null
          meta?: Json
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          recipient_name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address_type?: Database["public"]["Enums"]["address_type"]
          city?: string
          country?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string
          deleted_at?: string | null
          id?: string
          is_default_billing?: boolean
          is_default_shipping?: boolean
          label?: string | null
          line1?: string
          line2?: string | null
          meta?: Json
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          recipient_name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          auth_user_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string | null
          full_name: string
          id: string
          internal_notes: string | null
          last_order_at: string | null
          lifetime_orders_count: number
          lifetime_spend: number
          loyalty_meta: Json
          marketing_opt_in: boolean
          meta: Json
          phone: string | null
          preferred_contact_method: Database["public"]["Enums"]["contact_method_enum"]
          status: Database["public"]["Enums"]["customer_status"]
          tags: string[]
          updated_at: string
          updated_by: string | null
          whatsapp: string | null
          whatsapp_last_contact: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          internal_notes?: string | null
          last_order_at?: string | null
          lifetime_orders_count?: number
          lifetime_spend?: number
          loyalty_meta?: Json
          marketing_opt_in?: boolean
          meta?: Json
          phone?: string | null
          preferred_contact_method?: Database["public"]["Enums"]["contact_method_enum"]
          status?: Database["public"]["Enums"]["customer_status"]
          tags?: string[]
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
          whatsapp_last_contact?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          internal_notes?: string | null
          last_order_at?: string | null
          lifetime_orders_count?: number
          lifetime_spend?: number
          loyalty_meta?: Json
          marketing_opt_in?: boolean
          meta?: Json
          phone?: string | null
          preferred_contact_method?: Database["public"]["Enums"]["contact_method_enum"]
          status?: Database["public"]["Enums"]["customer_status"]
          tags?: string[]
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
          whatsapp_last_contact?: string | null
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          attempts: number
          bcc: string[]
          body_html: string | null
          body_text: string | null
          cc: string[]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          delivered_at: string | null
          failed_at: string | null
          from_address: string | null
          id: string
          last_error: string | null
          max_attempts: number
          metadata: Json
          provider: string | null
          provider_message_id: string | null
          reference_id: string | null
          reference_type: string | null
          reply_to: string | null
          scheduled_for: string
          sent_at: string | null
          status: Database["public"]["Enums"]["email_status"]
          subject: string
          template_code: string | null
          template_data: Json
          to_address: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          bcc?: string[]
          body_html?: string | null
          body_text?: string | null
          cc?: string[]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          failed_at?: string | null
          from_address?: string | null
          id?: string
          last_error?: string | null
          max_attempts?: number
          metadata?: Json
          provider?: string | null
          provider_message_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          reply_to?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          subject: string
          template_code?: string | null
          template_data?: Json
          to_address: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          bcc?: string[]
          body_html?: string | null
          body_text?: string | null
          cc?: string[]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          failed_at?: string | null
          from_address?: string | null
          id?: string
          last_error?: string | null
          max_attempts?: number
          metadata?: Json
          provider?: string | null
          provider_message_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          reply_to?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          subject?: string
          template_code?: string | null
          template_data?: Json
          to_address?: string
          updated_at?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          context: Json
          created_at: string
          deleted_at: string | null
          environment: string
          error_code: string | null
          fingerprint: string | null
          http_status: number | null
          id: string
          message: string
          metadata: Json
          request_id: string | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          route: string | null
          severity: Database["public"]["Enums"]["log_severity"]
          source: string
          stack_trace: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          context?: Json
          created_at?: string
          deleted_at?: string | null
          environment?: string
          error_code?: string | null
          fingerprint?: string | null
          http_status?: number | null
          id?: string
          message: string
          metadata?: Json
          request_id?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          route?: string | null
          severity?: Database["public"]["Enums"]["log_severity"]
          source?: string
          stack_trace?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          context?: Json
          created_at?: string
          deleted_at?: string | null
          environment?: string
          error_code?: string | null
          fingerprint?: string | null
          http_status?: number | null
          id?: string
          message?: string
          metadata?: Json
          request_id?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          route?: string | null
          severity?: Database["public"]["Enums"]["log_severity"]
          source?: string
          stack_trace?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          audience: Json
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          environment: string
          id: string
          is_enabled: boolean
          key: string
          metadata: Json
          rollout_percent: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          audience?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          environment?: string
          id?: string
          is_enabled?: boolean
          key: string
          metadata?: Json
          rollout_percent?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          audience?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          environment?: string
          id?: string
          is_enabled?: boolean
          key?: string
          metadata?: Json
          rollout_percent?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      footer_columns: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          display_order: number
          id: string
          is_active: boolean
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      footer_links: {
        Row: {
          column_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          display_order: number
          href: string
          id: string
          is_active: boolean
          label: string
          open_in_new_tab: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          column_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number
          href: string
          id?: string
          is_active?: boolean
          label: string
          open_in_new_tab?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          column_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number
          href?: string
          id?: string
          is_active?: boolean
          label?: string
          open_in_new_tab?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "footer_links_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "footer_columns"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_banners: {
        Row: {
          created_at: string
          created_by: string | null
          cta_href: string | null
          cta_label: string | null
          deleted_at: string | null
          display_order: number
          end_at: string | null
          eyebrow: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          is_active: boolean
          layout_variant: string
          meta: Json
          mobile_image_url: string | null
          secondary_cta_href: string | null
          secondary_cta_label: string | null
          start_at: string | null
          subtitle: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cta_href?: string | null
          cta_label?: string | null
          deleted_at?: string | null
          display_order?: number
          end_at?: string | null
          eyebrow?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_active?: boolean
          layout_variant?: string
          meta?: Json
          mobile_image_url?: string | null
          secondary_cta_href?: string | null
          secondary_cta_label?: string | null
          start_at?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cta_href?: string | null
          cta_label?: string | null
          deleted_at?: string | null
          display_order?: number
          end_at?: string | null
          eyebrow?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_active?: boolean
          layout_variant?: string
          meta?: Json
          mobile_image_url?: string | null
          secondary_cta_href?: string | null
          secondary_cta_label?: string | null
          start_at?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      homepage_section_items: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          display_order: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["homepage_item_entity"]
          id: string
          is_active: boolean
          meta: Json
          section_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["homepage_item_entity"]
          id?: string
          is_active?: boolean
          meta?: Json
          section_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["homepage_item_entity"]
          id?: string
          is_active?: boolean
          meta?: Json
          section_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homepage_section_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "homepage_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_sections: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          cta_href: string | null
          cta_label: string | null
          deleted_at: string | null
          display_order: number
          end_at: string | null
          eyebrow: string | null
          id: string
          is_active: boolean
          layout_variant: string
          max_items: number
          section_type: Database["public"]["Enums"]["homepage_section_type"]
          slug: string
          start_at: string | null
          subtitle: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by?: string | null
          cta_href?: string | null
          cta_label?: string | null
          deleted_at?: string | null
          display_order?: number
          end_at?: string | null
          eyebrow?: string | null
          id?: string
          is_active?: boolean
          layout_variant?: string
          max_items?: number
          section_type: Database["public"]["Enums"]["homepage_section_type"]
          slug: string
          start_at?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          cta_href?: string | null
          cta_label?: string | null
          deleted_at?: string | null
          display_order?: number
          end_at?: string | null
          eyebrow?: string | null
          id?: string
          is_active?: boolean
          layout_variant?: string
          max_items?: number
          section_type?: Database["public"]["Enums"]["homepage_section_type"]
          slug?: string
          start_at?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      integration_events: {
        Row: {
          created_at: string
          deleted_at: string | null
          direction: string
          error_message: string | null
          event_type: string
          external_id: string | null
          id: string
          integration: string
          metadata: Json
          payload: Json
          processed_at: string | null
          reference_id: string | null
          reference_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          direction: string
          error_message?: string | null
          event_type: string
          external_id?: string | null
          id?: string
          integration: string
          metadata?: Json
          payload?: Json
          processed_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          direction?: string
          error_message?: string | null
          event_type?: string
          external_id?: string | null
          id?: string
          integration?: string
          metadata?: Json
          payload?: Json
          processed_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          available_qty: number | null
          avg_cost: number
          created_at: string
          created_by: string | null
          id: string
          last_counted_at: string | null
          last_movement_at: string | null
          low_stock_threshold: number
          meta: Json
          on_hand_qty: number
          reorder_point: number
          reserved_qty: number
          updated_at: string
          updated_by: string | null
          variant_id: string
          warehouse_id: string
        }
        Insert: {
          available_qty?: number | null
          avg_cost?: number
          created_at?: string
          created_by?: string | null
          id?: string
          last_counted_at?: string | null
          last_movement_at?: string | null
          low_stock_threshold?: number
          meta?: Json
          on_hand_qty?: number
          reorder_point?: number
          reserved_qty?: number
          updated_at?: string
          updated_by?: string | null
          variant_id: string
          warehouse_id: string
        }
        Update: {
          available_qty?: number | null
          avg_cost?: number
          created_at?: string
          created_by?: string | null
          id?: string
          last_counted_at?: string | null
          last_movement_at?: string | null
          low_stock_threshold?: number
          meta?: Json
          on_hand_qty?: number
          reorder_point?: number
          reserved_qty?: number
          updated_at?: string
          updated_by?: string | null
          variant_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_ledger: {
        Row: {
          balance_after: number
          batch_id: string | null
          created_at: string
          created_by: string | null
          id: string
          meta: Json
          movement_type: Database["public"]["Enums"]["movement_type"]
          notes: string | null
          occurred_at: string
          qty_delta: number
          reference_id: string | null
          reference_type: string | null
          unit_cost: number | null
          variant_id: string
          warehouse_id: string
        }
        Insert: {
          balance_after: number
          batch_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          meta?: Json
          movement_type: Database["public"]["Enums"]["movement_type"]
          notes?: string | null
          occurred_at?: string
          qty_delta: number
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
          variant_id: string
          warehouse_id: string
        }
        Update: {
          balance_after?: number
          batch_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          meta?: Json
          movement_type?: Database["public"]["Enums"]["movement_type"]
          notes?: string | null
          occurred_at?: string
          qty_delta?: number
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
          variant_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_ledger_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "stock_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_ledger_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_ledger_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_windows: {
        Row: {
          allow_staff: boolean
          created_at: string
          created_by: string | null
          deleted_at: string | null
          ended_at: string | null
          id: string
          is_active: boolean
          message: string | null
          metadata: Json
          scheduled_end: string | null
          scheduled_start: string | null
          started_at: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          allow_staff?: boolean
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean
          message?: string | null
          metadata?: Json
          scheduled_end?: string | null
          scheduled_start?: string | null
          started_at?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          allow_staff?: boolean
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean
          message?: string | null
          metadata?: Json
          scheduled_end?: string | null
          scheduled_start?: string | null
          started_at?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          body: string
          channel: Database["public"]["Enums"]["notification_channel"]
          code: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean
          locale: string
          metadata: Json
          subject: string | null
          updated_at: string
          updated_by: string | null
          variables: Json
        }
        Insert: {
          body: string
          channel: Database["public"]["Enums"]["notification_channel"]
          code: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          locale?: string
          metadata?: Json
          subject?: string | null
          updated_at?: string
          updated_by?: string | null
          variables?: Json
        }
        Update: {
          body?: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          code?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          locale?: string
          metadata?: Json
          subject?: string | null
          updated_at?: string
          updated_by?: string | null
          variables?: Json
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          data: Json
          deleted_at: string | null
          delivered_at: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          is_read: boolean
          metadata: Json
          priority: Database["public"]["Enums"]["job_priority"]
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          template_code: string | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          data?: Json
          deleted_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          is_read?: boolean
          metadata?: Json
          priority?: Database["public"]["Enums"]["job_priority"]
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          template_code?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          data?: Json
          deleted_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          is_read?: boolean
          metadata?: Json
          priority?: Database["public"]["Enums"]["job_priority"]
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          template_code?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_events: {
        Row: {
          actor_id: string | null
          created_at: string
          event_type: string
          from_status: Database["public"]["Enums"]["order_status"] | null
          id: string
          is_internal: boolean
          message: string | null
          meta: Json
          order_id: string
          to_status: Database["public"]["Enums"]["order_status"] | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          event_type: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          is_internal?: boolean
          message?: string | null
          meta?: Json
          order_id: string
          to_status?: Database["public"]["Enums"]["order_status"] | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          event_type?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          is_internal?: boolean
          message?: string | null
          meta?: Json
          order_id?: string
          to_status?: Database["public"]["Enums"]["order_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          attributes_snapshot: Json
          brand_snapshot: string | null
          created_at: string
          discount_amount: number
          id: string
          image_snapshot: string | null
          inventory_snapshot: Json
          line_total: number
          meta: Json
          order_id: string
          product_id: string | null
          product_name_snapshot: string
          quantity: number
          reservation_id: string | null
          sku_snapshot: string
          tax_amount: number
          unit_price: number
          updated_at: string
          variant_id: string | null
          variant_name_snapshot: string | null
        }
        Insert: {
          attributes_snapshot?: Json
          brand_snapshot?: string | null
          created_at?: string
          discount_amount?: number
          id?: string
          image_snapshot?: string | null
          inventory_snapshot?: Json
          line_total: number
          meta?: Json
          order_id: string
          product_id?: string | null
          product_name_snapshot: string
          quantity: number
          reservation_id?: string | null
          sku_snapshot: string
          tax_amount?: number
          unit_price: number
          updated_at?: string
          variant_id?: string | null
          variant_name_snapshot?: string | null
        }
        Update: {
          attributes_snapshot?: Json
          brand_snapshot?: string | null
          created_at?: string
          discount_amount?: number
          id?: string
          image_snapshot?: string | null
          inventory_snapshot?: Json
          line_total?: number
          meta?: Json
          order_id?: string
          product_id?: string | null
          product_name_snapshot?: string
          quantity?: number
          reservation_id?: string | null
          sku_snapshot?: string
          tax_amount?: number
          unit_price?: number
          updated_at?: string
          variant_id?: string | null
          variant_name_snapshot?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "stock_reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json
          billing_address_id: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string
          customer_notes: string | null
          deleted_at: string | null
          delivered_at: string | null
          discount_total: number
          dispatched_at: string | null
          grand_total: number
          id: string
          internal_notes: string | null
          internal_reference: string | null
          is_cod: boolean
          meta: Json
          order_number: string
          order_source: Database["public"]["Enums"]["order_source_enum"]
          packed_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          quote_requested: boolean
          refunded_at: string | null
          return_reason: string | null
          returned_at: string | null
          shipping_address: Json
          shipping_address_id: string | null
          shipping_total: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax_total: number
          updated_at: string
          updated_by: string | null
          warehouse_id: string | null
          whatsapp_conversation_id: string | null
        }
        Insert: {
          billing_address?: Json
          billing_address_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id: string
          customer_notes?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          discount_total?: number
          dispatched_at?: string | null
          grand_total?: number
          id?: string
          internal_notes?: string | null
          internal_reference?: string | null
          is_cod?: boolean
          meta?: Json
          order_number?: string
          order_source?: Database["public"]["Enums"]["order_source_enum"]
          packed_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          quote_requested?: boolean
          refunded_at?: string | null
          return_reason?: string | null
          returned_at?: string | null
          shipping_address?: Json
          shipping_address_id?: string | null
          shipping_total?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_total?: number
          updated_at?: string
          updated_by?: string | null
          warehouse_id?: string | null
          whatsapp_conversation_id?: string | null
        }
        Update: {
          billing_address?: Json
          billing_address_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string
          customer_notes?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          discount_total?: number
          dispatched_at?: string | null
          grand_total?: number
          id?: string
          internal_notes?: string | null
          internal_reference?: string | null
          is_cod?: boolean
          meta?: Json
          order_number?: string
          order_source?: Database["public"]["Enums"]["order_source_enum"]
          packed_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          quote_requested?: boolean
          refunded_at?: string | null
          return_reason?: string | null
          returned_at?: string | null
          shipping_address?: Json
          shipping_address_id?: string | null
          shipping_total?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_total?: number
          updated_at?: string
          updated_by?: string | null
          warehouse_id?: string | null
          whatsapp_conversation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: string
          created_at: string
          created_by: string | null
          product_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          created_by?: string | null
          product_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          created_by?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_collections: {
        Row: {
          collection_id: string
          created_at: string
          created_by: string | null
          product_id: string
          sort_order: number
        }
        Insert: {
          collection_id: string
          created_at?: string
          created_by?: string | null
          product_id: string
          sort_order?: number
        }
        Update: {
          collection_id?: string
          created_at?: string
          created_by?: string | null
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_images: {
        Row: {
          ai_tags: string[]
          alt_text: string
          blurhash: string | null
          caption: string | null
          checksum_sha256: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          display_order: number
          dominant_color: string | null
          file_size_bytes: number | null
          focal_x: number | null
          focal_y: number | null
          format: Database["public"]["Enums"]["image_format"]
          height_px: number | null
          id: string
          is_active: boolean
          is_hover: boolean
          is_primary: boolean
          metadata: Json
          mime_type: string | null
          processing_status: Database["public"]["Enums"]["image_processing_status"]
          product_id: string
          role: Database["public"]["Enums"]["image_role"]
          storage_path: string
          updated_at: string
          updated_by: string | null
          url: string | null
          variant_id: string | null
          width_px: number | null
        }
        Insert: {
          ai_tags?: string[]
          alt_text: string
          blurhash?: string | null
          caption?: string | null
          checksum_sha256?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          display_order?: number
          dominant_color?: string | null
          file_size_bytes?: number | null
          focal_x?: number | null
          focal_y?: number | null
          format?: Database["public"]["Enums"]["image_format"]
          height_px?: number | null
          id?: string
          is_active?: boolean
          is_hover?: boolean
          is_primary?: boolean
          metadata?: Json
          mime_type?: string | null
          processing_status?: Database["public"]["Enums"]["image_processing_status"]
          product_id: string
          role?: Database["public"]["Enums"]["image_role"]
          storage_path: string
          updated_at?: string
          updated_by?: string | null
          url?: string | null
          variant_id?: string | null
          width_px?: number | null
        }
        Update: {
          ai_tags?: string[]
          alt_text?: string
          blurhash?: string | null
          caption?: string | null
          checksum_sha256?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          display_order?: number
          dominant_color?: string | null
          file_size_bytes?: number | null
          focal_x?: number | null
          focal_y?: number | null
          format?: Database["public"]["Enums"]["image_format"]
          height_px?: number | null
          id?: string
          is_active?: boolean
          is_hover?: boolean
          is_primary?: boolean
          metadata?: Json
          mime_type?: string | null
          processing_status?: Database["public"]["Enums"]["image_processing_status"]
          product_id?: string
          role?: Database["public"]["Enums"]["image_role"]
          storage_path?: string
          updated_at?: string
          updated_by?: string | null
          url?: string | null
          variant_id?: string | null
          width_px?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_search_terms: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_active: boolean
          locale: string
          product_id: string
          source: string
          term: string
          term_type: Database["public"]["Enums"]["search_term_type"]
          updated_at: string
          updated_by: string | null
          weight: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_active?: boolean
          locale?: string
          product_id: string
          source?: string
          term: string
          term_type?: Database["public"]["Enums"]["search_term_type"]
          updated_at?: string
          updated_by?: string | null
          weight?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_active?: boolean
          locale?: string
          product_id?: string
          source?: string
          term?: string
          term_type?: Database["public"]["Enums"]["search_term_type"]
          updated_at?: string
          updated_by?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_search_terms_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_search_terms_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_seo: {
        Row: {
          canonical_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          focus_keyword: string | null
          hreflang: Json
          id: string
          meta_description: string | null
          metadata: Json
          og_description: string | null
          og_image_url: string | null
          og_title: string | null
          og_type: string
          product_id: string
          robots: string
          seo_title: string | null
          structured_data: Json
          twitter_card: string
          twitter_description: string | null
          twitter_image_url: string | null
          twitter_title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          focus_keyword?: string | null
          hreflang?: Json
          id?: string
          meta_description?: string | null
          metadata?: Json
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          og_type?: string
          product_id: string
          robots?: string
          seo_title?: string | null
          structured_data?: Json
          twitter_card?: string
          twitter_description?: string | null
          twitter_image_url?: string | null
          twitter_title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          focus_keyword?: string | null
          hreflang?: Json
          id?: string
          meta_description?: string | null
          metadata?: Json
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          og_type?: string
          product_id?: string
          robots?: string
          seo_title?: string | null
          structured_data?: Json
          twitter_card?: string
          twitter_description?: string | null
          twitter_image_url?: string | null
          twitter_title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_seo_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_seo_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "v_low_stock"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          barcode: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          is_default: boolean
          meta: Json
          name: string
          original_price: number | null
          product_id: string
          sale_price: number | null
          sku: string
          sort_order: number
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          attributes?: Json
          barcode?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          meta?: Json
          name: string
          original_price?: number | null
          product_id: string
          sale_price?: number | null
          sku: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          attributes?: Json
          barcode?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          meta?: Json
          name?: string
          original_price?: number | null
          product_id?: string
          sale_price?: number | null
          sku?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_variants_sku_registry_fk"
            columns: ["sku"]
            isOneToOne: true
            referencedRelation: "sku_registry"
            referencedColumns: ["sku"]
          },
        ]
      }
      products: {
        Row: {
          attributes: Json
          barcode: string | null
          brand_id: string | null
          canonical_url: string | null
          created_at: string
          created_by: string | null
          currency: string
          deleted_at: string | null
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          is_best_seller: boolean
          is_editors_choice: boolean
          is_featured: boolean
          is_limited_stock: boolean
          is_new_arrival: boolean
          is_premium_outlet: boolean
          is_trending: boolean
          long_description: string | null
          meta: Json
          meta_description: string | null
          name: string
          og_image_url: string | null
          original_price: number
          primary_category_id: string | null
          published_at: string | null
          sale_price: number | null
          search_keywords: string[]
          seo_title: string | null
          short_description: string | null
          sku: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["product_status"]
          supplier_id: string | null
          tags: string[]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          attributes?: Json
          barcode?: string | null
          brand_id?: string | null
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          is_best_seller?: boolean
          is_editors_choice?: boolean
          is_featured?: boolean
          is_limited_stock?: boolean
          is_new_arrival?: boolean
          is_premium_outlet?: boolean
          is_trending?: boolean
          long_description?: string | null
          meta?: Json
          meta_description?: string | null
          name: string
          og_image_url?: string | null
          original_price: number
          primary_category_id?: string | null
          published_at?: string | null
          sale_price?: number | null
          search_keywords?: string[]
          seo_title?: string | null
          short_description?: string | null
          sku: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          supplier_id?: string | null
          tags?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          attributes?: Json
          barcode?: string | null
          brand_id?: string | null
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          is_best_seller?: boolean
          is_editors_choice?: boolean
          is_featured?: boolean
          is_limited_stock?: boolean
          is_new_arrival?: boolean
          is_premium_outlet?: boolean
          is_trending?: boolean
          long_description?: string | null
          meta?: Json
          meta_description?: string | null
          name?: string
          og_image_url?: string | null
          original_price?: number
          primary_category_id?: string | null
          published_at?: string | null
          sale_price?: number | null
          search_keywords?: string[]
          seo_title?: string | null
          short_description?: string | null
          sku?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          supplier_id?: string | null
          tags?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_primary_category_id_fkey"
            columns: ["primary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_sku_registry_fk"
            columns: ["sku"]
            isOneToOne: true
            referencedRelation: "sku_registry"
            referencedColumns: ["sku"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          last_seen_at: string | null
          marketing_opt_in: boolean
          phone: string | null
          preferred_language: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          last_seen_at?: string | null
          marketing_opt_in?: boolean
          phone?: string | null
          preferred_language?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          last_seen_at?: string | null
          marketing_opt_in?: boolean
          phone?: string | null
          preferred_language?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      promotional_banners: {
        Row: {
          background_color: string | null
          created_at: string
          created_by: string | null
          cta_label: string | null
          deleted_at: string | null
          display_order: number
          end_at: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          is_active: boolean
          link_href: string | null
          meta: Json
          mobile_image_url: string | null
          placement: Database["public"]["Enums"]["promo_banner_placement"]
          start_at: string | null
          subtitle: string | null
          text_color: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          background_color?: string | null
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          deleted_at?: string | null
          display_order?: number
          end_at?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_active?: boolean
          link_href?: string | null
          meta?: Json
          mobile_image_url?: string | null
          placement?: Database["public"]["Enums"]["promo_banner_placement"]
          start_at?: string | null
          subtitle?: string | null
          text_color?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          background_color?: string | null
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          deleted_at?: string | null
          display_order?: number
          end_at?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_active?: boolean
          link_href?: string | null
          meta?: Json
          mobile_image_url?: string | null
          placement?: Database["public"]["Enums"]["promo_banner_placement"]
          start_at?: string | null
          subtitle?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      purchase_receipt_items: {
        Row: {
          batch_id: string | null
          created_at: string
          created_by: string | null
          discount_amount: number
          id: string
          line_total: number
          meta: Json
          notes: string | null
          qty_ordered: number | null
          qty_received: number
          receipt_id: string
          tax_amount: number
          unit_cost: number
          updated_at: string
          updated_by: string | null
          variant_id: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number
          id?: string
          line_total?: number
          meta?: Json
          notes?: string | null
          qty_ordered?: number | null
          qty_received: number
          receipt_id: string
          tax_amount?: number
          unit_cost?: number
          updated_at?: string
          updated_by?: string | null
          variant_id: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number
          id?: string
          line_total?: number
          meta?: Json
          notes?: string | null
          qty_ordered?: number | null
          qty_received?: number
          receipt_id?: string
          tax_amount?: number
          unit_cost?: number
          updated_at?: string
          updated_by?: string | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_receipt_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "stock_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_receipt_items_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "purchase_receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_receipt_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_receipts: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string
          deleted_at: string | null
          discount_amount: number
          id: string
          invoice_date: string | null
          invoice_number: string | null
          meta: Json
          notes: string | null
          receipt_number: string
          received_at: string | null
          shipping_amount: number
          status: Database["public"]["Enums"]["purchase_receipt_status"]
          subtotal: number
          supplier_id: string
          tax_amount: number
          total_cost: number
          updated_at: string
          updated_by: string | null
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          discount_amount?: number
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          meta?: Json
          notes?: string | null
          receipt_number: string
          received_at?: string | null
          shipping_amount?: number
          status?: Database["public"]["Enums"]["purchase_receipt_status"]
          subtotal?: number
          supplier_id: string
          tax_amount?: number
          total_cost?: number
          updated_at?: string
          updated_by?: string | null
          warehouse_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          discount_amount?: number
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          meta?: Json
          notes?: string | null
          receipt_number?: string
          received_at?: string | null
          shipping_amount?: number
          status?: Database["public"]["Enums"]["purchase_receipt_status"]
          subtotal?: number
          supplier_id?: string
          tax_amount?: number
          total_cost?: number
          updated_at?: string
          updated_by?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_receipts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_receipts_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_jobs: {
        Row: {
          created_at: string
          created_by: string | null
          cron_expression: string
          deleted_at: string | null
          description: string | null
          failure_count: number
          id: string
          is_active: boolean
          job_type: string
          last_error: string | null
          last_run_at: string | null
          last_status: Database["public"]["Enums"]["job_status"] | null
          metadata: Json
          name: string
          next_run_at: string | null
          payload: Json
          run_count: number
          timezone: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cron_expression: string
          deleted_at?: string | null
          description?: string | null
          failure_count?: number
          id?: string
          is_active?: boolean
          job_type: string
          last_error?: string | null
          last_run_at?: string | null
          last_status?: Database["public"]["Enums"]["job_status"] | null
          metadata?: Json
          name: string
          next_run_at?: string | null
          payload?: Json
          run_count?: number
          timezone?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cron_expression?: string
          deleted_at?: string | null
          description?: string | null
          failure_count?: number
          id?: string
          is_active?: boolean
          job_type?: string
          last_error?: string | null
          last_run_at?: string | null
          last_status?: Database["public"]["Enums"]["job_status"] | null
          metadata?: Json
          name?: string
          next_run_at?: string | null
          payload?: Json
          run_count?: number
          timezone?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      schema_versions: {
        Row: {
          applied_at: string
          applied_by: string | null
          checksum: string | null
          id: string
          migration_name: string
          notes: string | null
          version: string
        }
        Insert: {
          applied_at?: string
          applied_by?: string | null
          checksum?: string | null
          id?: string
          migration_name: string
          notes?: string | null
          version: string
        }
        Update: {
          applied_at?: string
          applied_by?: string | null
          checksum?: string | null
          id?: string
          migration_name?: string
          notes?: string | null
          version?: string
        }
        Relationships: []
      }
      season_types: {
        Row: {
          code: string
          created_at: string
          is_active: boolean
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      seed_history: {
        Row: {
          applied_at: string
          applied_by: string | null
          checksum: string | null
          dataset_type: string | null
          id: string
          notes: string | null
          rows_affected: number | null
          seed_key: string
          seed_name: string
        }
        Insert: {
          applied_at?: string
          applied_by?: string | null
          checksum?: string | null
          dataset_type?: string | null
          id?: string
          notes?: string | null
          rows_affected?: number | null
          seed_key: string
          seed_name: string
        }
        Update: {
          applied_at?: string
          applied_by?: string | null
          checksum?: string | null
          dataset_type?: string | null
          id?: string
          notes?: string | null
          rows_affected?: number | null
          seed_key?: string
          seed_name?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          business_hours: string | null
          contact_address: string | null
          contact_city: string | null
          contact_country: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          created_at: string
          default_meta_description: string | null
          default_meta_title: string | null
          default_og_image_url: string | null
          default_twitter_handle: string | null
          id: boolean
          meta: Json
          robots_directives: string | null
          seo_keywords: string[] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          business_hours?: string | null
          contact_address?: string | null
          contact_city?: string | null
          contact_country?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          default_meta_description?: string | null
          default_meta_title?: string | null
          default_og_image_url?: string | null
          default_twitter_handle?: string | null
          id?: boolean
          meta?: Json
          robots_directives?: string | null
          seo_keywords?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          business_hours?: string | null
          contact_address?: string | null
          contact_city?: string | null
          contact_country?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          default_meta_description?: string | null
          default_meta_title?: string | null
          default_og_image_url?: string | null
          default_twitter_handle?: string | null
          id?: boolean
          meta?: Json
          robots_directives?: string | null
          seo_keywords?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      sku_registry: {
        Row: {
          entity_id: string | null
          entity_type: string
          notes: string | null
          reserved_at: string
          reserved_by: string | null
          sku: string
        }
        Insert: {
          entity_id?: string | null
          entity_type: string
          notes?: string | null
          reserved_at?: string
          reserved_by?: string | null
          sku: string
        }
        Update: {
          entity_id?: string | null
          entity_type?: string
          notes?: string | null
          reserved_at?: string
          reserved_by?: string | null
          sku?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          display_order: number
          handle: string | null
          icon: string | null
          id: string
          is_active: boolean
          platform: string
          updated_at: string
          updated_by: string | null
          url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number
          handle?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          platform: string
          updated_at?: string
          updated_by?: string | null
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number
          handle?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          platform?: string
          updated_at?: string
          updated_by?: string | null
          url?: string
        }
        Relationships: []
      }
      stock_batches: {
        Row: {
          batch_code: string
          created_at: string
          created_by: string | null
          currency: string
          expiry_at: string | null
          id: string
          manufacture_date: string | null
          meta: Json
          notes: string | null
          purchase_cost: number
          received_at: string
          received_qty: number
          remaining_qty: number
          supplier_id: string | null
          updated_at: string
          updated_by: string | null
          variant_id: string
          warehouse_id: string
        }
        Insert: {
          batch_code: string
          created_at?: string
          created_by?: string | null
          currency?: string
          expiry_at?: string | null
          id?: string
          manufacture_date?: string | null
          meta?: Json
          notes?: string | null
          purchase_cost?: number
          received_at?: string
          received_qty: number
          remaining_qty: number
          supplier_id?: string | null
          updated_at?: string
          updated_by?: string | null
          variant_id: string
          warehouse_id: string
        }
        Update: {
          batch_code?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          expiry_at?: string | null
          id?: string
          manufacture_date?: string | null
          meta?: Json
          notes?: string | null
          purchase_cost?: number
          received_at?: string
          received_qty?: number
          remaining_qty?: number
          supplier_id?: string | null
          updated_at?: string
          updated_by?: string | null
          variant_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_batches_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_batches_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_batches_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_reservations: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          fulfilled_at: string | null
          id: string
          meta: Json
          notes: string | null
          qty: number
          reference_id: string | null
          reference_type: string | null
          released_at: string | null
          status: Database["public"]["Enums"]["reservation_status"]
          updated_at: string
          updated_by: string | null
          variant_id: string
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          fulfilled_at?: string | null
          id?: string
          meta?: Json
          notes?: string | null
          qty: number
          reference_id?: string | null
          reference_type?: string | null
          released_at?: string | null
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
          updated_by?: string | null
          variant_id: string
          warehouse_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          fulfilled_at?: string | null
          id?: string
          meta?: Json
          notes?: string | null
          qty?: number
          reference_id?: string | null
          reference_type?: string | null
          released_at?: string | null
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
          updated_by?: string | null
          variant_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_reservations_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_reservations_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_name: string | null
          contact_person: string | null
          country: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string | null
          id: string
          meta: Json
          name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          slug: string
          state: string | null
          status: Database["public"]["Enums"]["supplier_status"]
          updated_at: string
          updated_by: string | null
          website_url: string | null
          whatsapp_number: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          meta?: Json
          name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          slug: string
          state?: string | null
          status?: Database["public"]["Enums"]["supplier_status"]
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          meta?: Json
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          slug?: string
          state?: string | null
          status?: Database["public"]["Enums"]["supplier_status"]
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      system_health_checks: {
        Row: {
          checked_at: string
          component: string
          created_at: string
          details: Json
          id: string
          latency_ms: number | null
          message: string | null
          status: Database["public"]["Enums"]["health_status"]
        }
        Insert: {
          checked_at?: string
          component: string
          created_at?: string
          details?: Json
          id?: string
          latency_ms?: number | null
          message?: string | null
          status?: Database["public"]["Enums"]["health_status"]
        }
        Update: {
          checked_at?: string
          component?: string
          created_at?: string
          details?: Json
          id?: string
          latency_ms?: number | null
          message?: string | null
          status?: Database["public"]["Enums"]["health_status"]
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          created_at: string
          device: string | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          path: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          path?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          path?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          granted_at: string
          granted_by: string | null
          id: string
          notes: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          address: Json
          code: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          is_default: boolean
          meta: Json
          name: string
          notes: string | null
          status: Database["public"]["Enums"]["warehouse_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: Json
          code: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          meta?: Json
          name: string
          notes?: string | null
          status?: Database["public"]["Enums"]["warehouse_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: Json
          code?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          meta?: Json
          name?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["warehouse_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      webhook_queue: {
        Row: {
          attempts: number
          created_at: string
          deleted_at: string | null
          endpoint_url: string
          event_type: string | null
          headers: Json
          http_method: string
          id: string
          last_attempt_at: string | null
          last_error: string | null
          last_response_body: string | null
          last_status_code: number | null
          max_attempts: number
          metadata: Json
          next_retry_at: string | null
          payload: Json
          reference_id: string | null
          reference_type: string | null
          scheduled_for: string
          secret_ref: string | null
          signature_header: string | null
          status: Database["public"]["Enums"]["webhook_status"]
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          deleted_at?: string | null
          endpoint_url: string
          event_type?: string | null
          headers?: Json
          http_method?: string
          id?: string
          last_attempt_at?: string | null
          last_error?: string | null
          last_response_body?: string | null
          last_status_code?: number | null
          max_attempts?: number
          metadata?: Json
          next_retry_at?: string | null
          payload?: Json
          reference_id?: string | null
          reference_type?: string | null
          scheduled_for?: string
          secret_ref?: string | null
          signature_header?: string | null
          status?: Database["public"]["Enums"]["webhook_status"]
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          deleted_at?: string | null
          endpoint_url?: string
          event_type?: string | null
          headers?: Json
          http_method?: string
          id?: string
          last_attempt_at?: string | null
          last_error?: string | null
          last_response_body?: string | null
          last_status_code?: number | null
          max_attempts?: number
          metadata?: Json
          next_retry_at?: string | null
          payload?: Json
          reference_id?: string | null
          reference_type?: string | null
          scheduled_for?: string
          secret_ref?: string | null
          signature_header?: string | null
          status?: Database["public"]["Enums"]["webhook_status"]
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_campaigns: {
        Row: {
          audience_filter: Json
          audience_size: number
          code: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          delivered_count: number
          description: string | null
          failed_count: number
          id: string
          metadata: Json
          name: string
          read_count: number
          reply_count: number
          scheduled_at: string | null
          sent_count: number
          started_at: string | null
          status: Database["public"]["Enums"]["whatsapp_campaign_status"]
          template_id: string | null
          updated_at: string
          updated_by: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          audience_filter?: Json
          audience_size?: number
          code?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          delivered_count?: number
          description?: string | null
          failed_count?: number
          id?: string
          metadata?: Json
          name: string
          read_count?: number
          reply_count?: number
          scheduled_at?: string | null
          sent_count?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["whatsapp_campaign_status"]
          template_id?: string | null
          updated_at?: string
          updated_by?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          audience_filter?: Json
          audience_size?: number
          code?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          delivered_count?: number
          description?: string | null
          failed_count?: number
          id?: string
          metadata?: Json
          name?: string
          read_count?: number
          reply_count?: number
          scheduled_at?: string | null
          sent_count?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["whatsapp_campaign_status"]
          template_id?: string | null
          updated_at?: string
          updated_by?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversation_events: {
        Row: {
          actor_id: string | null
          conversation_id: string
          created_at: string
          event_type: string
          from_value: string | null
          id: string
          metadata: Json
          notes: string | null
          to_value: string | null
        }
        Insert: {
          actor_id?: string | null
          conversation_id: string
          created_at?: string
          event_type: string
          from_value?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          to_value?: string | null
        }
        Update: {
          actor_id?: string | null
          conversation_id?: string
          created_at?: string
          event_type?: string
          from_value?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          to_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversation_events_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversations: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          campaign_id: string | null
          channel: Database["public"]["Enums"]["whatsapp_channel"]
          closed_at: string | null
          created_at: string
          created_by: string | null
          customer_id: string | null
          deleted_at: string | null
          entry_message: string | null
          first_response_at: string | null
          id: string
          internal_notes: string | null
          last_inbound_at: string | null
          last_message_at: string | null
          last_outbound_at: string | null
          message_count: number
          metadata: Json
          priority: Database["public"]["Enums"]["wa_priority"]
          provider_conversation_id: string | null
          provider_wa_id: string | null
          quote_requested: boolean
          related_order_id: string | null
          related_product_id: string | null
          related_variant_id: string | null
          resolved_at: string | null
          sla_breached: boolean
          sla_due_at: string | null
          snoozed_until: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["whatsapp_conversation_status"]
          subject: string | null
          tags: string[]
          topic: Database["public"]["Enums"]["whatsapp_conversation_topic"]
          unread_count: number
          updated_at: string
          updated_by: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          wa_display_name: string | null
          wa_phone_e164: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          campaign_id?: string | null
          channel?: Database["public"]["Enums"]["whatsapp_channel"]
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          entry_message?: string | null
          first_response_at?: string | null
          id?: string
          internal_notes?: string | null
          last_inbound_at?: string | null
          last_message_at?: string | null
          last_outbound_at?: string | null
          message_count?: number
          metadata?: Json
          priority?: Database["public"]["Enums"]["wa_priority"]
          provider_conversation_id?: string | null
          provider_wa_id?: string | null
          quote_requested?: boolean
          related_order_id?: string | null
          related_product_id?: string | null
          related_variant_id?: string | null
          resolved_at?: string | null
          sla_breached?: boolean
          sla_due_at?: string | null
          snoozed_until?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["whatsapp_conversation_status"]
          subject?: string | null
          tags?: string[]
          topic?: Database["public"]["Enums"]["whatsapp_conversation_topic"]
          unread_count?: number
          updated_at?: string
          updated_by?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wa_display_name?: string | null
          wa_phone_e164: string
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          campaign_id?: string | null
          channel?: Database["public"]["Enums"]["whatsapp_channel"]
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          entry_message?: string | null
          first_response_at?: string | null
          id?: string
          internal_notes?: string | null
          last_inbound_at?: string | null
          last_message_at?: string | null
          last_outbound_at?: string | null
          message_count?: number
          metadata?: Json
          priority?: Database["public"]["Enums"]["wa_priority"]
          provider_conversation_id?: string | null
          provider_wa_id?: string | null
          quote_requested?: boolean
          related_order_id?: string | null
          related_product_id?: string | null
          related_variant_id?: string | null
          resolved_at?: string | null
          sla_breached?: boolean
          sla_due_at?: string | null
          snoozed_until?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["whatsapp_conversation_status"]
          subject?: string | null
          tags?: string[]
          topic?: Database["public"]["Enums"]["whatsapp_conversation_topic"]
          unread_count?: number
          updated_at?: string
          updated_by?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wa_display_name?: string | null
          wa_phone_e164?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_related_order_id_fkey"
            columns: ["related_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_related_variant_id_fkey"
            columns: ["related_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          body: string | null
          campaign_id: string | null
          channel: Database["public"]["Enums"]["whatsapp_channel"]
          conversation_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          delivered_at: string | null
          direction: Database["public"]["Enums"]["whatsapp_message_direction"]
          error_code: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          interactive_payload: Json | null
          is_automated: boolean
          is_internal_note: boolean
          media_caption: string | null
          media_mime_type: string | null
          media_size_bytes: number | null
          media_url: string | null
          message_type: Database["public"]["Enums"]["whatsapp_message_type"]
          metadata: Json
          provider_message_id: string | null
          provider_reply_to_id: string | null
          read_at: string | null
          related_order_id: string | null
          related_product_id: string | null
          reply_to_message_id: string | null
          sent_at: string | null
          sent_by: string | null
          status: Database["public"]["Enums"]["whatsapp_delivery_status"]
          template_id: string | null
          template_variables: Json
          updated_at: string
        }
        Insert: {
          body?: string | null
          campaign_id?: string | null
          channel?: Database["public"]["Enums"]["whatsapp_channel"]
          conversation_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          direction: Database["public"]["Enums"]["whatsapp_message_direction"]
          error_code?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          interactive_payload?: Json | null
          is_automated?: boolean
          is_internal_note?: boolean
          media_caption?: string | null
          media_mime_type?: string | null
          media_size_bytes?: number | null
          media_url?: string | null
          message_type?: Database["public"]["Enums"]["whatsapp_message_type"]
          metadata?: Json
          provider_message_id?: string | null
          provider_reply_to_id?: string | null
          read_at?: string | null
          related_order_id?: string | null
          related_product_id?: string | null
          reply_to_message_id?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: Database["public"]["Enums"]["whatsapp_delivery_status"]
          template_id?: string | null
          template_variables?: Json
          updated_at?: string
        }
        Update: {
          body?: string | null
          campaign_id?: string | null
          channel?: Database["public"]["Enums"]["whatsapp_channel"]
          conversation_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          direction?: Database["public"]["Enums"]["whatsapp_message_direction"]
          error_code?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          interactive_payload?: Json | null
          is_automated?: boolean
          is_internal_note?: boolean
          media_caption?: string | null
          media_mime_type?: string | null
          media_size_bytes?: number | null
          media_url?: string | null
          message_type?: Database["public"]["Enums"]["whatsapp_message_type"]
          metadata?: Json
          provider_message_id?: string | null
          provider_reply_to_id?: string | null
          read_at?: string | null
          related_order_id?: string | null
          related_product_id?: string | null
          reply_to_message_id?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: Database["public"]["Enums"]["whatsapp_delivery_status"]
          template_id?: string | null
          template_variables?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_related_order_id_fkey"
            columns: ["related_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "whatsapp_messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_templates: {
        Row: {
          body: string
          buttons: Json
          category: Database["public"]["Enums"]["whatsapp_template_category"]
          code: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          footer: string | null
          header: string | null
          id: string
          language_code: string
          metadata: Json
          name: string
          provider_template_id: string | null
          status: Database["public"]["Enums"]["whatsapp_template_status"]
          updated_at: string
          updated_by: string | null
          variables: Json
        }
        Insert: {
          body: string
          buttons?: Json
          category?: Database["public"]["Enums"]["whatsapp_template_category"]
          code: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          footer?: string | null
          header?: string | null
          id?: string
          language_code?: string
          metadata?: Json
          name: string
          provider_template_id?: string | null
          status?: Database["public"]["Enums"]["whatsapp_template_status"]
          updated_at?: string
          updated_by?: string | null
          variables?: Json
        }
        Update: {
          body?: string
          buttons?: Json
          category?: Database["public"]["Enums"]["whatsapp_template_category"]
          code?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          footer?: string | null
          header?: string | null
          id?: string
          language_code?: string
          metadata?: Json
          name?: string
          provider_template_id?: string | null
          status?: Database["public"]["Enums"]["whatsapp_template_status"]
          updated_at?: string
          updated_by?: string | null
          variables?: Json
        }
        Relationships: []
      }
    }
    Views: {
      v_low_stock: {
        Row: {
          available_qty: number | null
          inventory_id: string | null
          last_movement_at: string | null
          low_stock_threshold: number | null
          on_hand_qty: number | null
          product_id: string | null
          product_name: string | null
          reorder_point: number | null
          reserved_qty: number | null
          sku: string | null
          stock_state: string | null
          variant_id: string | null
          variant_name: string | null
          warehouse_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_sku_registry_fk"
            columns: ["sku"]
            isOneToOne: true
            referencedRelation: "sku_registry"
            referencedColumns: ["sku"]
          },
        ]
      }
    }
    Functions: {
      cms_in_window: {
        Args: { _end: string; _start: string }
        Returns: boolean
      }
      customers_recalc_aggregates: {
        Args: { _customer_id: string }
        Returns: undefined
      }
      default_warehouse_id: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      generate_slug: { Args: { input_text: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      reserve_sku: {
        Args: { _entity_id: string; _entity_type: string; _sku: string }
        Returns: undefined
      }
    }
    Enums: {
      address_type: "shipping" | "billing" | "both"
      app_role: "super_admin" | "admin" | "manager" | "staff" | "customer"
      audit_action:
        | "insert"
        | "update"
        | "delete"
        | "soft_delete"
        | "restore"
        | "login"
        | "logout"
        | "export"
        | "import"
        | "role_change"
        | "permission_change"
        | "config_change"
        | "other"
      contact_method_enum: "whatsapp" | "phone" | "email" | "sms"
      customer_status: "active" | "inactive" | "blocked" | "archived"
      email_status:
        | "pending"
        | "queued"
        | "sending"
        | "sent"
        | "delivered"
        | "bounced"
        | "failed"
        | "cancelled"
      health_status: "healthy" | "degraded" | "down" | "unknown"
      homepage_item_entity: "product" | "brand" | "collection" | "category"
      homepage_section_type:
        | "featured_brands"
        | "featured_products"
        | "premium_outlet"
        | "new_arrivals"
        | "best_sellers"
        | "custom"
      image_format:
        | "jpg"
        | "jpeg"
        | "png"
        | "webp"
        | "avif"
        | "gif"
        | "svg"
        | "heic"
      image_processing_status: "pending" | "processing" | "ready" | "failed"
      image_role:
        | "gallery"
        | "primary"
        | "hover"
        | "swatch"
        | "lifestyle"
        | "detail"
        | "size_chart"
        | "video_poster"
      inventory_movement_type:
        | "purchase"
        | "sale"
        | "return"
        | "adjustment"
        | "reservation"
        | "release"
        | "damage"
        | "transfer"
      job_priority: "low" | "normal" | "high" | "critical"
      job_status:
        | "queued"
        | "running"
        | "succeeded"
        | "failed"
        | "cancelled"
        | "retrying"
        | "dead_letter"
      log_severity:
        | "debug"
        | "info"
        | "notice"
        | "warning"
        | "error"
        | "critical"
      movement_type:
        | "purchase_in"
        | "sale_out"
        | "return_in"
        | "return_out"
        | "adjustment_in"
        | "adjustment_out"
        | "transfer_in"
        | "transfer_out"
        | "reservation"
        | "release"
        | "damage"
        | "loss"
        | "correction"
        | "opening_stock"
      notification_channel:
        | "in_app"
        | "email"
        | "sms"
        | "whatsapp"
        | "push"
        | "webhook"
      notification_status:
        | "pending"
        | "queued"
        | "sending"
        | "sent"
        | "delivered"
        | "read"
        | "failed"
        | "cancelled"
      order_source_enum:
        | "website"
        | "whatsapp"
        | "manual_admin"
        | "phone"
        | "facebook"
        | "instagram"
      order_status:
        | "draft"
        | "pending"
        | "confirmed"
        | "packing"
        | "ready_to_dispatch"
        | "dispatched"
        | "delivered"
        | "cancelled"
        | "returned"
        | "refunded"
      payment_method:
        | "cod"
        | "bank_transfer"
        | "card"
        | "whatsapp"
        | "wallet"
        | "other"
      payment_status:
        | "unpaid"
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "cod_pending"
        | "partially_paid"
      product_status:
        | "draft"
        | "active"
        | "coming_soon"
        | "out_of_stock"
        | "archived"
        | "discontinued"
      promo_banner_placement:
        | "homepage_top"
        | "homepage_mid"
        | "homepage_bottom"
        | "sidebar"
        | "shop_top"
      purchase_receipt_status:
        | "draft"
        | "received"
        | "partially_received"
        | "cancelled"
      reservation_status: "active" | "fulfilled" | "released" | "expired"
      search_term_type:
        | "keyword"
        | "synonym"
        | "tag"
        | "misspelling"
        | "brand_alias"
      source_system:
        | "supabase"
        | "airtable"
        | "whatsapp"
        | "manual"
        | "api"
        | "system"
      supplier_status: "active" | "inactive" | "pending" | "blacklisted"
      sync_conflict_status:
        | "open"
        | "resolved_local"
        | "resolved_remote"
        | "resolved_manual"
        | "ignored"
      sync_conflict_type:
        | "updated_in_both"
        | "missing_local"
        | "missing_remote"
        | "duplicate"
        | "deleted_remote"
        | "deleted_local"
        | "schema_mismatch"
      sync_direction:
        | "airtable_to_supabase"
        | "supabase_to_airtable"
        | "bidirectional"
      sync_entity_type:
        | "product"
        | "product_variant"
        | "supplier"
        | "brand"
        | "category"
        | "collection"
        | "customer"
        | "order"
        | "inventory"
        | "product_image"
      sync_status: "pending" | "syncing" | "synced" | "failed" | "conflict"
      wa_priority: "low" | "normal" | "high" | "urgent"
      warehouse_status: "active" | "inactive"
      webhook_status:
        | "pending"
        | "sending"
        | "delivered"
        | "failed"
        | "retrying"
        | "dead_letter"
        | "cancelled"
      whatsapp_campaign_status:
        | "draft"
        | "scheduled"
        | "running"
        | "paused"
        | "completed"
        | "cancelled"
        | "failed"
      whatsapp_channel: "click_to_chat" | "cloud_api" | "manual" | "campaign"
      whatsapp_conversation_status:
        | "open"
        | "pending"
        | "waiting_customer"
        | "waiting_staff"
        | "snoozed"
        | "resolved"
        | "closed"
        | "archived"
      whatsapp_conversation_topic:
        | "general"
        | "product_inquiry"
        | "quote_request"
        | "order"
        | "support"
        | "complaint"
        | "shipping"
        | "payment"
        | "broadcast"
        | "other"
      whatsapp_delivery_status:
        | "queued"
        | "sent"
        | "delivered"
        | "read"
        | "failed"
        | "deleted"
      whatsapp_message_direction: "inbound" | "outbound"
      whatsapp_message_type:
        | "text"
        | "image"
        | "video"
        | "audio"
        | "document"
        | "sticker"
        | "location"
        | "contact"
        | "template"
        | "interactive"
        | "button"
        | "system"
        | "order"
        | "product"
        | "catalog"
      whatsapp_template_category:
        | "marketing"
        | "utility"
        | "authentication"
        | "service"
      whatsapp_template_status:
        | "draft"
        | "pending"
        | "approved"
        | "rejected"
        | "paused"
        | "disabled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      address_type: ["shipping", "billing", "both"],
      app_role: ["super_admin", "admin", "manager", "staff", "customer"],
      audit_action: [
        "insert",
        "update",
        "delete",
        "soft_delete",
        "restore",
        "login",
        "logout",
        "export",
        "import",
        "role_change",
        "permission_change",
        "config_change",
        "other",
      ],
      contact_method_enum: ["whatsapp", "phone", "email", "sms"],
      customer_status: ["active", "inactive", "blocked", "archived"],
      email_status: [
        "pending",
        "queued",
        "sending",
        "sent",
        "delivered",
        "bounced",
        "failed",
        "cancelled",
      ],
      health_status: ["healthy", "degraded", "down", "unknown"],
      homepage_item_entity: ["product", "brand", "collection", "category"],
      homepage_section_type: [
        "featured_brands",
        "featured_products",
        "premium_outlet",
        "new_arrivals",
        "best_sellers",
        "custom",
      ],
      image_format: [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "avif",
        "gif",
        "svg",
        "heic",
      ],
      image_processing_status: ["pending", "processing", "ready", "failed"],
      image_role: [
        "gallery",
        "primary",
        "hover",
        "swatch",
        "lifestyle",
        "detail",
        "size_chart",
        "video_poster",
      ],
      inventory_movement_type: [
        "purchase",
        "sale",
        "return",
        "adjustment",
        "reservation",
        "release",
        "damage",
        "transfer",
      ],
      job_priority: ["low", "normal", "high", "critical"],
      job_status: [
        "queued",
        "running",
        "succeeded",
        "failed",
        "cancelled",
        "retrying",
        "dead_letter",
      ],
      log_severity: ["debug", "info", "notice", "warning", "error", "critical"],
      movement_type: [
        "purchase_in",
        "sale_out",
        "return_in",
        "return_out",
        "adjustment_in",
        "adjustment_out",
        "transfer_in",
        "transfer_out",
        "reservation",
        "release",
        "damage",
        "loss",
        "correction",
        "opening_stock",
      ],
      notification_channel: [
        "in_app",
        "email",
        "sms",
        "whatsapp",
        "push",
        "webhook",
      ],
      notification_status: [
        "pending",
        "queued",
        "sending",
        "sent",
        "delivered",
        "read",
        "failed",
        "cancelled",
      ],
      order_source_enum: [
        "website",
        "whatsapp",
        "manual_admin",
        "phone",
        "facebook",
        "instagram",
      ],
      order_status: [
        "draft",
        "pending",
        "confirmed",
        "packing",
        "ready_to_dispatch",
        "dispatched",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      payment_method: [
        "cod",
        "bank_transfer",
        "card",
        "whatsapp",
        "wallet",
        "other",
      ],
      payment_status: [
        "unpaid",
        "pending",
        "paid",
        "failed",
        "refunded",
        "cod_pending",
        "partially_paid",
      ],
      product_status: [
        "draft",
        "active",
        "coming_soon",
        "out_of_stock",
        "archived",
        "discontinued",
      ],
      promo_banner_placement: [
        "homepage_top",
        "homepage_mid",
        "homepage_bottom",
        "sidebar",
        "shop_top",
      ],
      purchase_receipt_status: [
        "draft",
        "received",
        "partially_received",
        "cancelled",
      ],
      reservation_status: ["active", "fulfilled", "released", "expired"],
      search_term_type: [
        "keyword",
        "synonym",
        "tag",
        "misspelling",
        "brand_alias",
      ],
      source_system: [
        "supabase",
        "airtable",
        "whatsapp",
        "manual",
        "api",
        "system",
      ],
      supplier_status: ["active", "inactive", "pending", "blacklisted"],
      sync_conflict_status: [
        "open",
        "resolved_local",
        "resolved_remote",
        "resolved_manual",
        "ignored",
      ],
      sync_conflict_type: [
        "updated_in_both",
        "missing_local",
        "missing_remote",
        "duplicate",
        "deleted_remote",
        "deleted_local",
        "schema_mismatch",
      ],
      sync_direction: [
        "airtable_to_supabase",
        "supabase_to_airtable",
        "bidirectional",
      ],
      sync_entity_type: [
        "product",
        "product_variant",
        "supplier",
        "brand",
        "category",
        "collection",
        "customer",
        "order",
        "inventory",
        "product_image",
      ],
      sync_status: ["pending", "syncing", "synced", "failed", "conflict"],
      wa_priority: ["low", "normal", "high", "urgent"],
      warehouse_status: ["active", "inactive"],
      webhook_status: [
        "pending",
        "sending",
        "delivered",
        "failed",
        "retrying",
        "dead_letter",
        "cancelled",
      ],
      whatsapp_campaign_status: [
        "draft",
        "scheduled",
        "running",
        "paused",
        "completed",
        "cancelled",
        "failed",
      ],
      whatsapp_channel: ["click_to_chat", "cloud_api", "manual", "campaign"],
      whatsapp_conversation_status: [
        "open",
        "pending",
        "waiting_customer",
        "waiting_staff",
        "snoozed",
        "resolved",
        "closed",
        "archived",
      ],
      whatsapp_conversation_topic: [
        "general",
        "product_inquiry",
        "quote_request",
        "order",
        "support",
        "complaint",
        "shipping",
        "payment",
        "broadcast",
        "other",
      ],
      whatsapp_delivery_status: [
        "queued",
        "sent",
        "delivered",
        "read",
        "failed",
        "deleted",
      ],
      whatsapp_message_direction: ["inbound", "outbound"],
      whatsapp_message_type: [
        "text",
        "image",
        "video",
        "audio",
        "document",
        "sticker",
        "location",
        "contact",
        "template",
        "interactive",
        "button",
        "system",
        "order",
        "product",
        "catalog",
      ],
      whatsapp_template_category: [
        "marketing",
        "utility",
        "authentication",
        "service",
      ],
      whatsapp_template_status: [
        "draft",
        "pending",
        "approved",
        "rejected",
        "paused",
        "disabled",
      ],
    },
  },
} as const
