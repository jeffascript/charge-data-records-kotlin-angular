CREATE TABLE IF NOT EXISTS charge_data_record (
                                                  id UUID PRIMARY KEY,
                                                  charging_session_id TEXT NOT NULL,
                                                  vehicle_id TEXT NOT NULL,
                                                  start_time TIMESTAMP NOT NULL,
                                                  end_time TIMESTAMP NOT NULL,
                                                  total_cost DECIMAL(10,2) NOT NULL
    );

INSERT INTO charge_data_record (id, charging_session_id, vehicle_id, start_time, end_time, total_cost)
VALUES
    ('c5ee9512-8338-4166-8c60-e0b031c6585f', 'session-1', 'vehicle-1', '2023-05-01 10:00:00', '2023-05-01 12:30:00', 25.99),
    ('57f6f59d-c18c-4135-b453-bb1a170ac136', 'session-2', 'vehicle-2', '2023-06-02 14:15:00', '2023-06-02 16:45:00', 18.75),
    ('cf528796-6051-4668-b134-f17f145524c7', 'session-3', 'vehicle-3', '2023-07-01 10:00:00', '2023-07-01 12:30:00', 5.99),
    ('ea6ed60f-010d-494d-b210-9a86d1877e02', 'session-4', 'vehicle-4', '2023-08-02 14:15:00', '2023-08-02 16:45:00', 11.75);
