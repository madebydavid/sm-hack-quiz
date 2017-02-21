
Vagrant.configure(2) do |config|

    config.vm.box = "debian/jessie64"

    config.vm.network "private_network", type: "dhcp"
    config.vm.network "forwarded_port", guest: 80, host: 8080
    
    # general provisioning script
    config.vm.provision :shell,
        :path => "ops/provisioning/base.sh"

    config.ssh.forward_agent = true
    config.vm.synced_folder ".", "/vagrant", type: "virtualbox"

end