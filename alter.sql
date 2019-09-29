alter.sql
use flight;
alter table fdList modify column lastupdate timestamp null default current_timestamp;
alter table fd_result modify column lastupdate timestamp not null default current_timestamp;

use buk;
alter table t240 modify column create_time timestamp null default current_timestamp;
alter table pnr_log modify column lastupdate timestamp null default current_timestamp;
