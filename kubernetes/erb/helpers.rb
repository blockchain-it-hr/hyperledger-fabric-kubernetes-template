#!/usr/bin/ruby
module Helpers

  def Helpers.initialize
    @config = YAML.load_file('environment.yaml')
    @organizations = @config['organizations']
    @orderers = @config['orderers']
  end

  def Helpers.load_general_config
    @version = @config['version']
    @namespace = @config['namespace']
    @hostname = @config['hostname']
    @database_host = @config['database_host']
    @database_username = @config['database_username']
    @database_password = @config['database_password']
    @database_database = @config['database_database']
    @admin_username = @config['admin_username']
    @admin_password = @config['admin_password']
    @TZ = @config['TZ']
    nil
  end

  def Helpers.load_orderer_template_vars(values)
    @CONFIGTX_ORDERER_KAFKA_BROKERS = values['CONFIGTX_ORDERER_KAFKA_BROKERS']
    @CONFIGTX_ORDERER_ADDRESSES = values['CONFIGTX_ORDERER_ADDRESSES']
    @ORDERER_GENERAL_LISTENADDRESS = values['ORDERER_GENERAL_LISTENADDRESS']
    @ORDERER_GENERAL_LISTENPORT = values['ORDERER_GENERAL_LISTENPORT']
    @ORDERER_GENERAL_LOGLEVEL = values['ORDERER_GENERAL_LOGLEVEL']
    nil
  end

  def Helpers.load_peer_template_vars(values)
    @name = values['name']
    @selector = values['selector']
    nil
  end

  def Helpers.iterate_orderers
    @orderers.each do |orderer|
      @orderer_name = orderer.keys.first
      load_orderer_template_vars(orderer.values.first)
    end
  end

  def Helpers.iterate_organizations
    @organizations.each do |organization|
      @organization_name = organization.keys.first
      organization.values.first.each do |peer|
        @peer_name = peer.keys.first
        load_peer_template_vars(peer.values.first)
      end
    end
  end
end
